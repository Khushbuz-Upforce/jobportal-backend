const express = require("express");
const { verifyToken } = require("../Middleware/Auth");

const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const cloudinary = require("../Config/cloudinary");
const { getApplications, applyToJob, getUserApplications } = require("../Controllers/ApplicationController");

const routes = express.Router();

const resumeStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "resumes",
        resource_type: "raw", // THIS IS CRITICAL
        allowed_formats: ["pdf", "doc", "docx"],
    },
});

const uploadResume = multer({ storage: resumeStorage });

routes.get("/getApplications", verifyToken, getApplications);
routes.post("/apply", verifyToken, uploadResume.single("resume"), applyToJob);
routes.get("/my-applications", verifyToken, getUserApplications);

module.exports = routes;
