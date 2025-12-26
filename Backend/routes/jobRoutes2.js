const express = require('express');
const { isAuthenticated, isAuthorized } = require('../middlewares/auth.js');
const { getAllJobs, getJobById } = require('../controllers/jobController.js');

const jobRouter2 = express.Router();

jobRouter2.get('/', getAllJobs);
jobRouter2.get('/:id', getJobById);

module.exports = jobRouter2;