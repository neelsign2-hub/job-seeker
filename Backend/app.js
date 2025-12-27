const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const { connection } = require('./DB_connect.js');
const { errorHandler } = require('./middlewares/errorHandler.js');
const userRouter = require('./routes/userRoutes.js');
const jobRouter1 = require('./routes/jobRoutes1.js');
const jobRouter2 = require('./routes/jobRoutes2.js');
const companyRouter = require('./routes/companyRoutes.js');
const reviewRouter = require('./routes/reviewRoutes.js');
const applicationRouter = require('./routes/applicationRoutes.js');

const app = express();

app.use(cors({
    origin: ['https://careerxpert.vercel.app', 'http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'], // Allow requests from frontend origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Specify allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
    credentials: true,
  }));


  // https://careerxpert.vercel.app

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/v1/user', userRouter);

app.use('/api/v1/job', jobRouter1);

app.use('/api/v1/jobs', jobRouter2);

app.use('/api/v1/company', companyRouter);

app.use('/api/v1/application', applicationRouter);

app.use('/api/v1/review', reviewRouter);

connection();

app.use(errorHandler);

module.exports = app;