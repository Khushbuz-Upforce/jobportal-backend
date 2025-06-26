const express = require("express");
const { verifyToken } = require("../Middleware/Auth");
const { createOrUpdateCompany, addRecruiterJob, getRecruiterJobs, deleteRecruiterJob } = require("../Controllers/RecruiterController");


const routes = express.Router();

routes.post('/company', verifyToken, createOrUpdateCompany)
routes.post('/addRecruiterJob', verifyToken, addRecruiterJob)
routes.get('/getRecruiterJobs', verifyToken, getRecruiterJobs)
routes.delete('/deleteRecruiterJob/:id', verifyToken, deleteRecruiterJob)

module.exports = routes