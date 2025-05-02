if(process.env.NODE_ENV != "production") {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const listRouter = require('./Router/listing.js');
const reviewRouter = require('./Router/review.js');
const userRouter = require('./Router/user.js');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const LocalStrategy = require('passport-local');
const passport = require('passport');
const User = require('./Models/user.js');


// const MONGO_URL = "mongodb://127.0.0.1:27017/Wanderlust";
const dbUrl = process.env.ATLASDB_URL;

main().then(() => {
    console.log("Connected to the Server");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(dbUrl)
}


const store =  MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24 * 3600
});

store.on("ERROR", () => {
    console.log("ERROR IN MONGO SESSION STORE", err);
});

const sessionObject = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expireDate: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
};


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.use(session(sessionObject));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

app.use("/allLists", listRouter);
app.use("/allLists/:id/reviews", reviewRouter);
app.use("/", userRouter);

const port = 1010;
app.listen(port, () => {
    console.log(`Listening on port : ${port}`);
});

app.get('/', (req, res) => {
    res.send("Hello! I'm root")
});


app.all(/.*/, (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
    let {statusCode = 500, message = "Something went wrong..."} = err;
    res.status(statusCode).render("error.ejs", { message});
    // res.status(statusCode).send(message);
});