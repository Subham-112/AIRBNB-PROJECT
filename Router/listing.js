const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner, validateListing} = require('../middlewere.js');
const multer  = require('multer')
const { storage } = require('../cloudConfig.js');
const upload = multer({ storage });


// controller
const listController = require('../controller/listing.js');


router.route("/")
.get(wrapAsync(listController.index))
.post(
    isLoggedIn,
    upload.single("listings[image]"), 
    validateListing, 
    wrapAsync(listController.createListing)
);



//New Route:--
router.get("/new", isLoggedIn, listController.newListing);


router.route("/:id")
.get(wrapAsync(listController.showListing))
.put(
    isLoggedIn, 
    isOwner,validateListing,
    upload.single("listings[image]"), 
    wrapAsync(listController.updateListing)
)
.delete(
    isLoggedIn, 
    isOwner,  
    wrapAsync(listController.deleteListing)
);


//Edit Route:--
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listController.editListing));


module.exports = router;