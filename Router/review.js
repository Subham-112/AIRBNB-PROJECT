const express = require('express');
const route = express.Router({mergeParams: true});
const Listing = require('../Models/listing.js');
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require('../Models/review.js');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middlewere.js');

// controller
const reviewController = require('../controller/review.js');



// Reviews
// Post route
route.post("/", validateReview, isLoggedIn, wrapAsync(reviewController.postReview));

// Delete Route:--
route.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.deleteReview));

module.exports = route;