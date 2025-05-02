const Listing = require('../Models/listing');
const Review = require('../Models/review');

module.exports.postReview = async(req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);


    await newReview.save();
    await listing.save();
    req.flash("success", "Review added");
    res.redirect(`/allLists/${listing._id}`);
}

module.exports.deleteReview = async(req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted");
    res.redirect(`/allLists/${id}`);
}