const express = require("express");
const {
  deleteCompany,
  getAllCompanies,
  getCompanyById,
  getMyCompanies,
  registerCompany,
  updateCompany,
} = require("../controllers/companyController.js");
const { isAuthenticated, isAuthorized } = require("../middlewares/auth.js");
const { addReview, getReviews } = require("../controllers/reviewController.js");
// const jobRouter = require('./jobRoutes.js')

// Create a new router
const companyRouter = express.Router();

// Define routes
// companyRouter.post('/register', isAuthenticated, isAuthorized('Recruiter'), registerCompany)
companyRouter.post("/register", isAuthenticated, registerCompany);
// companyRouter.put('/update/:id', isAuthenticated, isAuthorized('Recruiter'), updateCompany)
companyRouter.put("/update/:id", isAuthenticated, updateCompany);
// companyRouter.delete('/delete/:id', isAuthenticated, isAuthorized('Recruiter'), deleteCompany)
companyRouter.delete("/delete/:id", isAuthenticated, deleteCompany);

// companyRouter.get('/my-companies', isAuthenticated, isAuthorized('Recruiter'), getMyCompanies)
companyRouter.get("/my-companies", isAuthenticated, getMyCompanies);
companyRouter.get("/", getAllCompanies);
companyRouter.get("/:id", getCompanyById);

companyRouter.post(
  "/:id/reviews",
  isAuthenticated,
  isAuthorized("Job Seeker"),
  addReview
);
companyRouter.get("/:id/reviews", isAuthenticated, getReviews);

// companyRouter.use('/:companyId/jobs', jobRouter)

module.exports = companyRouter;