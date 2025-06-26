const express = require("express");

const routes = express.Router();

routes.use("/auth", require("../Routes/UserRoutes"))
routes.use("/recruiter", require("../Routes/recruitersRoutes"))
routes.use("/admin", require("../Routes/adminRoutes"))
routes.use("/application", require("../Routes/applicationsRoutes"))


module.exports = routes;