const { catchAsync } = require("../middlewares/catchAsync.js");
const { AppError } = require("../middlewares/errorHandler.js");
const { User } = require("../models/userModel.js");
const { sendVerificationEmail, sendEmail } = require("../utils/sendEmail.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { Job } = require("../models/jobModel.js");
const multer = require("multer");
const path = require("path");
const fs = require("fs");


// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
// });

const signToken = (id) => {
  // create token
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res, message) => {
  const token = signToken(user._id);

  // cookie options
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: true,
  };

  res.cookie("token", token, cookieOptions); // send token via cookie for security
  res.status(statusCode).json({
    status: "success",
    message,
    user,
    token,
  });
};

const register = catchAsync(async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;

    // check if required fields are empty
    if (!username || !email || !password || !role) {
      return next(new AppError("Empty required field.", 400));
    }

    if(username){
      if(username.length<3 || username.length>30){
        return next(new AppError("Username must be 3 to 30 characters", 400))
      }
    }

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email format validation
      if (!emailRegex.test(email)) {
        return next(new AppError("Invalid email format", 400));
      }
    }

    if (password) {
      if (password.length < 8) {
        return next(new AppError("Password must be at least 8 characters long", 400));
      }
    }
    

    // check if email is already registered
    const isExist = await User.findOne({ email });
    if (isExist) {
      return next(new AppError("Email is already registered.", 400));
    }

    // create verification token
    const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const user = new User({
      username,
      email,
      password,
      role,
    });

    await user.save();

    // send verification email to user
    // Commented out for local development - uncomment when email is configured
    // await sendVerificationEmail(email, verificationToken);

    res.status(200).json({
      status: "success",
      message: "Signup successful!", // Updated message
      user,
      verificationToken,
    });
  } catch (err) {
    res.status(400).json({
      status: "failure",
      message: err.message,
    });
  }
});

const verifyEmail = catchAsync(async (req, res, next) => {
  try {
    const { token } = req.query;

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user by email
    const user = await User.findOne({ email: decoded.email });

    if (!user || user.isVerified) {
      return next(
        new AppError("Invalid token or already verified account.", 400)
      );
    }

    // Update user status to verified
    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res
      .status(200)
      .json({ status: "success", message: "Email verified successfully." });
  } catch (error) {
    res.status(400).json({ status: "failure", message: error.message });
  }
});

const login = catchAsync(async (req, res, next) => {
  const { email, password, role } = req.body;

  // check if required fields are empty
  if (!role || !email || !password) {
    return next(new AppError("Empty required field.", 400));
  }

  // check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError("Invalid Email.", 400));
  }

  // comapre password with hashed password that is stored in database
  // const passwordMatch = await bcrypt.compare(password, user.password);

  // if (!passwordMatch) {
  //   return next(new AppError("Wrong password.", 400));
  // }

  // if (role !== user.role) {
  //   return next(new AppError("invalid credentials", 400));
  // }

  if (!user.isVerified) {
    return next(
      new AppError("Email is not verified yet, please do it first", 400)
    );
  }

  // if everything is correct, send token to client
  createSendToken(user, 201, res, "user logged in successfully");
});

const logout = catchAsync(async (req, res, next) => {
  // clear cookie by expiring it at current time
  console.log("Logout request received:", req.headers);

  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({
      status: "success",
      message: "logged out successfully...",
    });

  // after that it will be removed from client side, now shoul be redirected to login page
});

const forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new AppError("User not found with that email.", 404));

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString("hex");
  user.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // Token expires in 10 minutes
  await user.save({ validateBeforeSave: false });

  // Send token via email - but don't fail if email is not configured
  const resetURL = `https://careerxpert.vercel.app/reset-password/${resetToken}`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Password Reset Request",
      message: `Forgot your password? Submit a new password and confirm password to: ${resetURL}`,
    });
  } catch (emailError) {
    console.log('Failed to send reset email:', emailError.message);
    // Continue anyway - user can still use the token if they have it
  }

  res.status(200).json({
    status: "success",
    message: "Password reset token generated. Check your email if configured.",
    resetToken,
  });
});

const resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) return next(new AppError("Token is invalid or has expired", 400));
  
  if (req.body.password) {
    if (req.body.password.length < 8) {
      return next(new AppError("Password must be at least 8 characters long", 400));
    }
  }
  
  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  createSendToken(user, 200, res, "Password reset successfull.");
});

const getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (typeof user.socialLinks === "string") {
    user.socialLinks = JSON.parse(user.socialLinks);
  }
  if (typeof user.jobPreference === "string") {
    user.jobPreference = JSON.parse(user.jobPreference);
  }

  // if (!user) {
  //   return next(new AppError("No user found with that ID", 404));
  // }

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

// const updateProfile = catchAsync(async (req, res, next) => {
//   // Prevent password updates through this route
//   if (req.body.password || req.body.passwordConfirm) {
//     return next(
//       new AppError(
//         "This route is not for password updates. Please use /updatePassword",
//         400
//       )
//     );
//   }

//   // Clone and sanitize update data
//   const updateData = { ...req.body };
//   const sensitiveFields = [
//     "password",
//     "email",
//     "role",
//     "isVerified",
//     "verificationToken",
//     "passwordChangedAt",
//     "passwordResetToken",
//     "passwordResetExpires",
//   ];
//   sensitiveFields.forEach((field) => delete updateData[field]);

//   // Handle file uploads with Cloudinary
//   try {
//     if (req.files?.profilePhoto) {
//       const profilePhoto = await cloudinary.uploader.upload(
//         req.files.profilePhoto.tempFilePath,
//         {
//           folder: "profile-photos",
//           width: 150,
//           height: 150,
//           crop: "fill",
//         }
//       );

//       if (profilePhoto?.secure_url) {
//         updateData.profilePhoto = {
//           id: profilePhoto.public_id,
//           url: profilePhoto.secure_url,
//         };
//       } else {
//         throw new AppError("Error uploading profile photo", 400);
//       }
//     }

//     console.log(req?.files, "RESUME");

//     if (req?.files?.resume) {
//       const resume = await cloudinary.uploader.upload(
//         req.files.resume.tempFilePath, // The temporary file path of the uploaded file
//         {
//           folder: "resumes", // Cloudinary folder where the file will be stored
//         }
//       );

//       if (resume?.secure_url) {
//         updateData.resume = {
//           id: resume.public_id, // Save the public ID for future operations (e.g., deletion)
//           url: resume.secure_url, // Save the URL for direct access
//         };
//       } else {
//         throw new AppError("Error uploading resume", 400);
//       }
//     }
//   } catch (error) {
//     return next(new AppError(error.message || "File upload failed", 500));
//   }

//   // Update user document
//   const user = await User.findByIdAndUpdate(req.user._id, updateData, {
//     new: true,
//     runValidators: true,
//   });

//   if (!user) {
//     return next(new AppError("User not found", 404));
//   }

//   // Respond with updated user data
//   res.status(200).json({
//     status: "success",
//     message: "Profile updated successfully",
//     user,
//   });
// });

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "..", "uploads");
const profilePhotosDir = path.join(uploadsDir, "profile-photos");
const resumesDir = path.join(uploadsDir, "resumes");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
if (!fs.existsSync(profilePhotosDir)) {
  fs.mkdirSync(profilePhotosDir, { recursive: true });
}
if (!fs.existsSync(resumesDir)) {
  fs.mkdirSync(resumesDir, { recursive: true });
}

// Multer configuration for local file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "profilePhoto") {
      cb(null, profilePhotosDir);
    } else if (file.fieldname === "resume") {
      cb(null, resumesDir);
    } else {
      cb(null, uploadsDir);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter to accept only specific file types
const fileFilter = (req, file, cb) => {
  if (file.fieldname === "profilePhoto") {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/jpg") {
      cb(null, true);
    } else {
      cb(new AppError("Only JPEG, JPG and PNG images are allowed for profile photo!", 400), false);
    }
  } else if (file.fieldname === "resume") {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new AppError("Only PDF files are allowed for resume!", 400), false);
    }
  } else {
    cb(new AppError("Unsupported file format!", 400), false);
  }
};

// Multer instance with file size limits
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

const updateProfile = [
  upload.fields([
    { name: "profilePhoto", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]),
  catchAsync(async (req, res, next) => {
    const updateData = { ...req.body };

    // Sanitize sensitive fields
    const sensitiveFields = [
      "password",
      "email",
      "role",
      "isVerified",
      "verificationToken",
      "passwordChangedAt",
      "passwordResetToken",
      "passwordResetExpires",
    ];

    sensitiveFields.forEach((field) => delete updateData[field]);

    if (updateData.skills && Array.isArray(updateData.skills)) {
      const skillPattern = /\d/; // Checks for any numeric characters
      for (let skill of updateData.skills) {
        if (skill && skillPattern.test(skill)) {
          return next(new AppError("Skill names must not contain numeric values", 400));
        }
      }
    }
    
    // console.log(updateData.DOB)
    // if (new Date(updateData.DOB) > new Date()) {
    //   return next(new AppError("Deadline cannot be in the past", 400));
    // }

    if(updateData.username){
      if(updateData.username.length<3 || updateData.username.length>30){
        return next(new AppError("Username must be 3 to 30 characters", 400))
      }
    }

    if(updateData.aboutMe){
      if(updateData.aboutMe.length>500){
        return next(new AppError("About can not be of greater than 500 characters", 400));
      }
    }

    if (updateData.city) {
      const cityNamePattern = /^[A-Za-z\s]+$/; // Only allows letters and spaces
      if (!cityNamePattern.test(updateData.city)) {
        return next(new AppError("City name must only contain alphabetic characters and spaces", 400));
      }
    }

    
    if (updateData.phone) {
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(updateData.phone)) {
        return next(new AppError("Invalid phone number", 400));
      }
    }

    const socialLinks = JSON.parse(updateData.socialLinks);
    console.log(socialLinks)
    // if (socialLinks.twitter) {
    //   const twitterRegex = /^https:\/\/(www\.)?x\.com\//;
    //   if (!twitterRegex.test(socialLinks.twitter)) {
    //     console.log('error in twitter url')
    //     return next(new AppError("Invalid Twitter URL format", 400));
    //   }
    // }
    
    if (socialLinks.github) {
      const githubRegex = /^https:\/\/(www\.)?github\.com\//;
      if (!githubRegex.test(socialLinks.github)) {
        console.log('error in github url')
        return next(new AppError("Invalid GitHub URL format", 400));
      }
    }
    
    
    if (socialLinks.linkedin) {
      const linkedinRegex = /^https:\/\/(www\.)?linkedin\.com\//;
      if (!linkedinRegex.test(socialLinks.linkedin)) {
        console.log('error in linkedin url')
        return next(new AppError("Invalid LinkedIn URL format", 400));
      }
    }

    if (socialLinks.portfolio) {
      const portfolioRegex = /^(https?:\/\/)(www\.)?([a-zA-Z0-9-]+)(\.[a-zA-Z]{2,})(\/[\w-./?%&=]*)?$/;
      if (!portfolioRegex.test(socialLinks.portfolio)) {
        console.log('error in portfolio url')
        return next(new AppError("Invalid portfolio URL format", 400));
      }
    }


    try {
      // Handle profile photo upload
      if (req.files?.profilePhoto) {
        const file = req.files.profilePhoto[0];
        
        // Delete old profile photo if exists
        if (req.user.profilePhoto && req.user.profilePhoto.id) {
          const oldPhotoPath = path.join(__dirname, "..", req.user.profilePhoto.id);
          if (fs.existsSync(oldPhotoPath)) {
            fs.unlinkSync(oldPhotoPath);
          }
        }

        // Store relative path for database
        const relativePath = path.join("uploads", "profile-photos", file.filename);
        updateData.profilePhoto = {
          id: relativePath, // Store relative path as id
          url: `${req.protocol}://${req.get("host")}/${relativePath.replace(/\\/g, "/")}`, // Full URL
        };
      }

      // Handle resume upload
      if (req?.files?.resume) {
        const file = req.files.resume[0];
        
        // Delete old resume if exists
        if (req.user.resume && req.user.resume.id) {
          const oldResumePath = path.join(__dirname, "..", req.user.resume.id);
          if (fs.existsSync(oldResumePath)) {
            fs.unlinkSync(oldResumePath);
          }
        }

        // Store relative path for database
        const relativePath = path.join("uploads", "resumes", file.filename);
        updateData.resume = {
          id: relativePath, // Store relative path as id
          url: `${req.protocol}://${req.get("host")}/${relativePath.replace(/\\/g, "/")}`, // Full URL
        };
      }
    } catch (error) {
      return next(new AppError(error.message || "File upload failed", 500));
    }

    // Update user data in the database
    const user = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
      runValidators: true,
    });

    // if (!user) {
    //   return next(new AppError("User not found", 404));
    // }

    res.status(200).json({
      status: "success",
      message: "Profile updated successfully",
      user,
    });
  }),
];

const deleteUserbyId = async (req, res) => {
  console.log(req.params);

  try {
    // Destructure the 'id' parameter from the request
    const { id } = req.params;

    // console.log(id);

    // Attempt to delete the user from the database using their ID
    await User.deleteOne({ _id: id });

  //   if (result.deletedCount === 0) {
  //     return res.status(404).json({
  //         status: 'failure',
  //         message: `User with ID: ${id} not found`,
  //     });
  // }
    // Send a success response if the user is deleted
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    // Send an error response if an exception occurs
    return res.status(404).json({ message: "Error" });
  }
};

const getJobRecommendations = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  const { skills, jobPreference, city } = user;

  // Build the query object with proper validation
  const query = {
    $or: [
      {
        requirements: {
          $in: Array.isArray(skills)
            ? skills
            : skills.split(",").map((skill) => skill.trim()),
        },
      },
      {
        category: {
          $in: [
            jobPreference.first,
            jobPreference.second,
            jobPreference.third,
          ].filter(Boolean),
        },
      },
      { location: city },
    ],
  };

  const jobs = await Job.find(query).limit(50); // Add a limit to avoid large responses

  if (!jobs.length) {
    return res.status(200).json({
      status: "success",
      message: "No jobs found matching your preferences",
      results: 0,
      jobs: [],
    });
  }

  res.status(200).json({
    status: "success",
    results: jobs.length,
    jobs,
  });
});

module.exports = {
  register,
  verifyEmail,
  login,
  logout,
  forgotPassword,
  resetPassword,
  getMe,
  updateProfile,
  deleteUserbyId,
  getJobRecommendations
};