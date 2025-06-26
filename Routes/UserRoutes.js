const express = require("express");
const { RegisterUser, login, logout, getAllUsers, getUserProfile, createUser, updateUser, deleteUser, updateUserProfile } = require("../Controllers/UserController");
const { verifyToken } = require("../Middleware/Auth");


const routes = express.Router();

routes.post('/register', RegisterUser)
routes.post('/login', login)
routes.post('/logout', logout)
routes.get('/getAllUsers', getAllUsers)
routes.get('/getUserProfile', verifyToken, getUserProfile)

routes.post("/user", createUser);
routes.put("/user/:id", updateUser);
routes.delete("/user/:id", deleteUser);
routes.put('/profile', verifyToken, updateUserProfile);

module.exports = routes