const User = require('../Models/user.js');

module.exports.renderSignup = (req, res) => {
    res.render("users/signup.ejs");
}

module.exports.postSignup = async(req, res) => {
    try {
        let {username, email, password} = req.body;
        const newUser = new User({username, email});
        let userRegister = await User.register(newUser, password);
        console.log(userRegister);
        req.login(userRegister, (err) => {
            if(err) {
                return next(err);
            };
            req.flash("success", "Welcome to Airbnb");
            res.redirect("/allLists");
        });
    } catch(e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    };
}

module.exports.renderLogin = (req, res) => {
    res.render("users/login.ejs");
}

module.exports.postLogin = (req, res) => {
    req.flash("success", "Welcome back again to Airbnb");
    const redirectPath = res.locals.redirectUrl || "/allLists";
    res.redirect(redirectPath);
}

module.exports.postLogout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are logged out");
        res.redirect("/allLists");
    });
}