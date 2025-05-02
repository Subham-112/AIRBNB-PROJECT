const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const { redirectUrl } = require('../middlewere.js');

// controller
const userController = require('../controller/user.js');


router.route("/signup")
.get(userController.renderSignup)
.post(wrapAsync(userController.postSignup));


router.route("/login")
.get(userController.renderLogin)
.post(redirectUrl,
    passport.authenticate("local", 
        {failureRedirect: "/login", failureFlash: true}), userController.postLogin);


router.post("/logout", userController.postLogout);


module.exports = router;