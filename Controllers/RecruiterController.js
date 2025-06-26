const Company = require("../Models/CompanyModel");
const RecruiterJob = require("../Models/RecruiterJob");

const createOrUpdateCompany = async (req, res) => {
    const { name, logo, website, description, industry } = req.body;
    const recruiterId = req.user.id;
    console.log(recruiterId, "RId");

    console.log(req.body, "company");


    try {
        let company = await Company.findOne({ recruiterId });
        console.log(recruiterId, "RecruretId");

        if (company) {
            company = await Company.findOneAndUpdate(
                { recruiterId },
                { name, logo, website, description, industry },
                { new: true }
            );
        } else {
            company = await Company.create({ recruiterId, name, logo, website, description, industry });
        }

        return res.status(200).json({ success: true, company });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
};

const addRecruiterJob = async (req, res) => {
    const recruiterId = req.user.id;
    const { companyId, title, description, location, salary, category, status, file } = req.body;
    // console.log(req.body, "ADD recruiter");

    try {
        const job = await RecruiterJob.create({
            recruiterId,
            companyId,
            title,
            description,
            location,
            salary,
            category,
            status,
            file,
        });

        res.status(201).json({ success: true, job });
    } catch (error) {
        res.status(500).json({ message: "Error creating job", error });
    }
};

const getRecruiterJobs = async (req, res) => {
    try {
        // const jobs = await RecruiterJob.find({ recruiterId: req.user.id }).populate("companyId");
        const jobs = await RecruiterJob.find({ recruiterId: req.user.id });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

const deleteRecruiterJob = async (req, res) => {
    try {
        await RecruiterJob.findByIdAndDelete(req.params.id);
        res.json({ message: "Job deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

module.exports = {
    createOrUpdateCompany,
    addRecruiterJob,
    getRecruiterJobs,
    deleteRecruiterJob,
};
