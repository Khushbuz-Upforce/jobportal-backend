// models/Application.js
const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
    {
        applicantName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        resume: {
            type: String,
            required: false,
        },
        coverLetter: {
            type: String,
        },
        jobId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "RecruiterJob", // Matches the job schema name
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users", // optional if logged-in users apply
        },
        status: {
            type: String,
            enum: ["Pending", "Reviewed", "Shortlisted", "Rejected", "Hired"],
            default: "Pending",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Application", applicationSchema);
