const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../Middleware/Auth");
const { getAllJobs, updateJob, deleteJob, getAllCompanies, updateCompany, createJob, createCompany, getApplications, creatApplication, getDashboard, getNotigication, clearNotifications, getJobCategories, getCompanyIndustry } = require("../Controllers/AdminController");
const multer = require("multer");
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../Config/cloudinary');

const path = require("path");
const fs = require("fs");

// cloudinary 

const jobImageStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'job_images',
        // allowed_formats: ['jpg', 'png', 'jpeg'],
    },
});
const uploadJobImage = multer({ storage: jobImageStorage });

const companyLogoStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'company_images',
        // allowed_formats: ['jpg', 'png', 'jpeg'],
    },
});
// const uploadCompanyLogo = multer({ storage: companyLogoStorage });
const uploadCompanyLogo = multer({ storage: companyLogoStorage });

router.post("/uploadCompanyLogo", uploadCompanyLogo.single("file"), async (req, res) => {
    const { oldFile } = req.body;
    console.log(req.body, "Company file");
    try {
        // Delete old logo from Cloudinary if exists
        if (oldFile) {
            await cloudinary.uploader.destroy(oldFile);
            console.log("Old logo deleted:", oldFile);
        }

        // Upload new logo to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            resource_type: "image",
            public_id: `company_logos/${req.file.filename.split(".")[0]}`,
            width: 1000,
            height: 1000,
            crop: "fill",
        });

        res.json({
            url: result.secure_url,
            filename: result.public_id, // This is the public_id you’ll need for deletion
        });
    } catch (error) {
        console.error("Cloudinary upload failed:", error.message);
        res.status(500).json({ error: "Upload failed" });
    }
});

router.post("/uploadJobImage", uploadJobImage.single("file"), async (req, res) => {
    try {
        // Delete the old image if 'oldFile' is provided
        const oldPublicId = req.body.oldFile;

        if (oldPublicId) {
            await cloudinary.uploader.destroy(oldPublicId);
        }

        // Respond with new image details
        res.json({
            url: req.file.path,        // New image URL
            filename: req.file.filename, // New image public_id
        });
    } catch (error) {
        console.error("Image upload or deletion failed:", error);
        res.status(500).json({ error: "Image upload or deletion failed" });
    }
});


router.post("/createJob", verifyToken, isAdmin, createJob);

router.get("/getAllJobs", verifyToken, getAllJobs);
router.put("/updateJob/:id", verifyToken, isAdmin, updateJob);
router.delete("/deleteJob/:id", verifyToken, isAdmin, deleteJob);

// Companies
router.post("/createCompany", verifyToken, isAdmin, createCompany);

router.get("/getAllCompanies", verifyToken, isAdmin, getAllCompanies);
router.put("/updateCompany/:id", verifyToken, isAdmin, updateCompany);

// Applications
router.get("/getApplications", verifyToken, isAdmin, getApplications);
router.post("/createApplications", verifyToken, isAdmin, creatApplication)

// Dashboard count stat
router.get('/dashboardCount', verifyToken, isAdmin, getDashboard)
router.get('/getNotigication', verifyToken, isAdmin, getNotigication)
router.delete('/clear', clearNotifications);

// job catrgory

router.get("/job-categories", getJobCategories); // ✅ Add this
router.get("/job-industry", getCompanyIndustry); // ✅ Add this


module.exports = router;
