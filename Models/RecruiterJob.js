const mongoose = require("mongoose");

const recruiterJobSchema = new mongoose.Schema({
    recruiterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: false,
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true,
    },
    title: String,
    description: String,
    location: String,
    salary: String,
    category: String,
    status: { type: String, enum: ["open", "closed", "draft"], default: "open" },
    JobImage: String // optional file upload (image, PDF, etc.)
}, { timestamps: true });

module.exports = mongoose.model("RecruiterJob", recruiterJobSchema);
