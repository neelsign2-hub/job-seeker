const express = require('express');
const { isAuthenticated, isAuthorized } = require('../middlewares/auth.js');
const { addReview, deleteReview, getReviews, updateReview } = require('../controllers/reviewController.js');

const reviewRouter = express.Router();

reviewRouter.post('/:companyId', isAuthenticated, isAuthorized('Job Seeker'), addReview);
reviewRouter.get('/:companyId', isAuthenticated, getReviews);
reviewRouter.delete('/:reviewId', isAuthenticated, isAuthorized('Job Seeker'), deleteReview);
reviewRouter.patch('/:reviewId', isAuthenticated, isAuthorized('Job Seeker'), updateReview);

module.exports = reviewRouter;