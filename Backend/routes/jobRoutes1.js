const express = require("express");
const { isAuthenticated, isAuthorized } = require("../middlewares/auth.js");
const {
  createJob,
  updateJob,
  deleteJob,
  getCompanyJobs,
} = require("../controllers/jobController.js");

const jobRouter1 = express.Router();

jobRouter1.post(
  "/:companyId",
  isAuthenticated,
  isAuthorized("Recruiter"),
  createJob
);
jobRouter1.get("/:companyId", getCompanyJobs);
jobRouter1.put("/:id", isAuthenticated, isAuthorized("Recruiter"), updateJob);
jobRouter1.delete(
  "/:id",
  isAuthenticated,
  isAuthorized("Recruiter"),
  deleteJob
);

module.exports = jobRouter1;
