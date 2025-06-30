const UserModel = require('../Models/UserModel')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();


const RegisterUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        // console.log(req.body, "Body");

        if (!username || !email || !password) {
            return res.status(400).json({
                status: false,
                massage: "All fields are required",
            });
        }

        //Privent Duplucates
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(401).json({
                status: false,
                massage: "Email Already registered",
            });
        }
        //Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await UserModel.create({ username, email, password: hashedPassword, role })
        // console.log(user, "user");
        //Generate Token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.SECRET_KEY,
            {
                expiresIn: "1h",
            }
        );
        // console.log(token, "token");

        return res.status(201).json({ message: 'User created successfully', token })

    } catch (error) {
        return res.status(500).json({ message: 'Error creating user', error })
    }
}
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // console.log(req.body, "loginUser")

        const user = await UserModel.findOne({ email });
        // console.log(user);

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).send({ message: "Invalid credentials" });

        }
        const Users = {
            username: user.username,
            email: user.email,
            role: user.role
        }

        // // generate token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.SECRET_KEY,
            {
                expiresIn: "24h",
            }
        );
        // console.log(token, "token");

        res.cookie("refreshToken", token, {
            httpOnly: true,
            sameSite: "None",
            secure: true,
            maxAge: 3 * 60 * 60 * 1000, // 3 hours in milliseconds
        });

        return res.status(201).json({
            status: true,
            message: "Login successful",
            token,
            Users
        });

    } catch (error) {
        return res.status(400).send({
            success: false,
            massage: error,
        });
    }
};

const logout = (req, res) => {

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });

    return res.status(200).send({
        status: true,
        message: "User logged out successfully",
    });
};
// const getAllUsers = async (req, res) => {
//     try {
//         const users = await UserModel.find({}, "name email role"); // return selected fields
//         return res.status(200).send(users);
//     } catch (error) {
//         console.error("Error fetching users:", error);
//         return res.status(500).send({ message: "Server error" });
//     }
// };

// Controller: Get all users with search, sorting, and pagination
const getAllUsers = async (req, res) => {
    try {
        // Extract query parameters
        const {
            page = 1,
            limit = 10,
            search = "",
            sortBy = "createdAt",
            sortOrder = "desc",
            role
        } = req.query;

        const skip = (page - 1) * limit;

        // Build dynamic search query
        const searchQuery = {
            $and: [
                {
                    $or: [
                        { username: { $regex: search, $options: "i" } },
                        { email: { $regex: search, $options: "i" } }
                    ]
                }
            ]
        };

        // Optional role filter
        if (role && role !== "all") {
            searchQuery.$and.push({ role });
        }

        // Sort object
        const sortOptions = {
            [sortBy]: sortOrder === "asc" ? 1 : -1
        };

        // Fetch data
        const users = await UserModel.find(searchQuery, "username email role createdAt")
            .sort(sortOptions)
            .skip(parseInt(skip))
            .limit(parseInt(limit));

        // Count for pagination
        const totalCount = await UserModel.countDocuments(searchQuery);
        const totalPages = Math.ceil(totalCount / limit);

        return res.status(200).json({
            success: true,
            users,
            pagination: {
                totalUsers: totalCount,
                totalPages,
                currentPage: Number(page),
                limit: Number(limit)
            }
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch users",
            error: error.message
        });
    }
};


const getUserProfile = async (req, res) => {
    try {
        const user = await UserModel.findById(req.user.id);
        console.log(user, "users");

        res.send(user);
    } catch (err) {
        res.status(500).send({ message: 'Server error' });
    }
};
const createUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const user = new UserModel({ username, email, password, role });
        await user.save();
        res.status(201).json({ success: true, user });
    } catch (error) {
        console.error("Create user error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Edit User
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, password, role } = req.body;
        // Check for duplicate username
        const existingUsername = await UserModel.findOne({ username, _id: { $ne: id } });
        if (existingUsername) {
            return res.status(400).json({ message: "Username already taken" });
        }

        // Check for duplicate email
        const existingEmail = await UserModel.findOne({ email, _id: { $ne: id } });
        if (existingEmail) {
            return res.status(400).json({ message: "Email already in exist" });
        }

        const updates = { username, email, role };

        // If password is provided, include it
        if (password) {
            updates.password = password;
        }

        const user = await UserModel.findByIdAndUpdate(id, updates, { new: true });
        res.status(200).json({ success: true, user });
    } catch (error) {
        console.error("Update user error:", error);
        res.status(500).json({ message: "Server error" });
    }
};


// Delete User
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await UserModel.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "User deleted" });
    } catch (error) {
        console.error("Delete user error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
const updateUserProfile = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const userId = req.user.id;

        const updates = { username, email };

        // If password is provided, hash it
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updates.password = hashedPassword;
        }

        const updatedUser = await UserModel.findByIdAndUpdate(userId, updates, { new: true });

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: {
                username: updatedUser.username,
                email: updatedUser.email,
                role: updatedUser.role
            }
        });
    } catch (error) {
        console.error("Update profile error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

module.exports = {
    RegisterUser,
    login,
    logout,
    getAllUsers,
    getUserProfile,
    createUser,
    updateUser,
    deleteUser,
    updateUserProfile
};