const { populate } = require("dotenv");
const { catchAsync } = require("../middlewares/catchAsync.js");
const { AppError } = require("../middlewares/errorHandler.js");
const { Application } = require("../models/applicationModel.js");
const { Job } = require("../models/jobModel.js");
const { User } = require("../models/userModel.js");
const { sendEmail } = require("../utils/sendEmail.js");

const sendApplicationConfirmationEmail = async (
  userEmail,
  userName,
  jobTitle,
  companyName
) => {
  const subject = `🎉 Application Successful for ${jobTitle} at ${companyName}`;

  const textMessage = `
Dear ${userName},

Congratulations! 🎉

Your application for the position of ${jobTitle} at ${companyName} has been successfully submitted.

Our team will review your profile and get back to you soon regarding the next steps.

Thank you for considering ${companyName} as your next career opportunity. If you have any questions, feel free to contact us.

Wishing you the best of luck!

Warm regards,
CareerXpert
  `;

  const htmlMessage = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; }
    .container { max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
    .header { text-align: center; background: #4caf50; color: white; padding: 10px; border-radius: 8px 8px 0 0; }
    .content { padding: 20px; line-height: 1.6; color: #333; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Application Submitted Successfully 🎉</h1>
    </div>
    <div class="content">
      <p>Dear <strong>${userName}</strong>,</p>
      <p>Congratulations! 🎉</p>
      <p>Your application for the position of <strong>${jobTitle}</strong> at <strong>${companyName}</strong> has been successfully submitted.</p>
      <p>Our team will review your profile and get back to you soon regarding the next steps.</p>
      <p>Thank you for considering <strong>${companyName}</strong> as your next career opportunity. If you have any questions, feel free to contact us.</p>
      <p>Wishing you the best of luck!</p>
      <p>Warm regards,<br>CareerXpert</p>
    </div>
  </div>
</body>
</html>
  `;

  await sendEmail({
    email: userEmail,
    subject: subject,
    message: textMessage, // Fallback text version
    html: htmlMessage, // HTML version
  });
};

// Apply for a job
const applyForJob = catchAsync(async (req, res, next) => {
  const { jobId } = req.params;
  const { resume } = req.body;
  const applicantId = req.user._id;

  const job = await Job.findById(jobId).populate("company");
  if (!job) {
    return next(new AppError("Job not found", 404));
  }

  const existingApplication = await Application.findOne({
    job : jobId,
    applicant: applicantId
  })

  if(existingApplication){
    return next(new AppError("You have already applied for this job", 400));
  }

  const application = new Application({
    job: jobId,
    applicant: applicantId,
    resume,
  });

  await application.save();

  await sendApplicationConfirmationEmail(
    req?.user?.email,
    req?.user?.username,
    job?.title,
    job?.company?.name
  );

  res.status(201).json({
    status: "success",
    message: "Application submitted successfully",
    application,
  });
});

// Get all applications for a job
const getJobApplications = catchAsync(async (req, res, next) => {
  const { jobId } = req.params;

  const applications = await Application.find({ job: jobId }).populate(
    "applicant"
  );

  res.status(200).json({
    status: "success",
    results: applications.length,
    applications,
  });
});

// Get all applications by a user
const getUserApplications = catchAsync(async (req, res, next) => {
  const applicantId = req.user._id;

  const applications = await Application.find({
    applicant: applicantId,
  }).populate({
    path: "job",
    populate: {
      path: "company",
    },
  });

  res.status(200).json({
    status: "success",
    results: applications.length,
    applications,
  });
});

// Update application status
const updateApplicationStatus = catchAsync(async (req, res, next) => {
  const { applicationId } = req.params;
  const { status, feedback } = req.body;

  const application = await Application.findById(applicationId);
  if (!application) {
    return next(new AppError("Application not found", 404));
  }

  application.status = status;
  application.feedback = feedback;
  await application.save();

  res.status(200).json({
    status: "success",
    message: "Application status updated successfully",
    application,
  });
});

// Get application by ID
const getApplicationById = catchAsync(async (req, res, next) => {
  const { applicationId } = req.params;

  const application = await Application.findById(applicationId).populate(
    "job applicant"
  );
  if (!application) {
    return next(new AppError("Application not found", 404));
  }

  res.status(200).json({
    status: "success",
    application,
  });
});

module.exports = {
  applyForJob,
  getJobApplications,
  getUserApplications,
  updateApplicationStatus,
  getApplicationById,
};