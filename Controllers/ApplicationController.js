const Application = require("../Models/ApplicationModel");
const NotificationModel = require("../Models/NotificationModel.js");
const Job = require("../Models/RecruiterJob.js");

const getApplications = async (req, res) => {
    try {
        const { search = "", page = 1, limit = 10 } = req.query;

        const query = search
            ? {
                $or: [
                    { applicantName: { $regex: search, $options: "i" } },
                ],
            }
            : {};

        const applications = await Application.find(query)
            .populate("jobId", "title")
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const total = await Application.countDocuments(query);
        console.log(applications);

        res.status(200).json({
            applications,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch applications", error });
    }
};


const applyToJob = async (req, res) => {
    try {
        const { applicantName, email, phone, coverLetter, jobId } = req.body;
        const resumeUrl = req.file?.path;
        const userId = req.user?.id;

        // Check if user has already applied to this job
        const existingApplication = await Application.findOne({ userId, jobId });

        if (existingApplication) {

            // console.log("You have already applied for this job.");

            return res.status(400).json({ message: "You have already applied for this job." });
        }

        // Create new application
        const newApplication = new Application({
            applicantName,
            email,
            phone,
            coverLetter,
            resume: resumeUrl,
            jobId,
            userId,
        });

        await newApplication.save();

        const job = await Job.findById(jobId);
        const jobTitle = job?.title || "a job";

        //  Create and save notification
        const notification = new NotificationModel({
            message: `${applicantName} applied for "${jobTitle}"`,
            type: "application",
        });
        await notification.save();

        //  Emit real-time notification
        if (req.app.get("io")) {
            req.app.get("io").emit("new_notification", notification);
        }

        res.status(201).json({ message: "Application submitted successfully" });

    } catch (err) {
        console.error("Error applying to job:", err);
        res.status(500).json({ message: "Something went wrong" });
    }
};

const getUserApplications = async (req, res) => {
    try {
        const userId = req.user.id;
        // console.log(userId, "UserId");

        const applications = await Application.find({ userId })
            .populate("jobId", "title company") // add more fields if needed
            .sort({ createdAt: -1 });

        res.status(200).json({ applications });
    } catch (err) {
        console.error("Failed to fetch user applications:", err);
        res.status(500).json({ message: "Failed to fetch applications" });
    }
};

module.exports = {
    getApplications,
    applyToJob,
    getUserApplications
}
