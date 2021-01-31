if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const path = require("path");
//requiring and running express
const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }));
//requiring and setting engine to ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
//setting static files 
app.use(express.static(path.join(__dirname, "public")));
//mongoose setup
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/artiBrowse", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Mongo connection successfully created");
}).catch(() => {
    console.log("Mongo connection failed");
});
mongoose.set("useCreateIndex", true);
//requiring and setting up method-override
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
//requiring ejs-matr
const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);
//requiring joi
const joi = require("joi");

// setting up express-session
const session = require("express-session");
app.use(session({
    name: "session2",
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
        // secure: true
    }
}));

//requiring my user schema
const { userSchema } = require("./schema/userSchema");
//requiring passport and using it
const passport = require("passport");
const passportLocal = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");



userSchema.plugin(passportLocalMongoose);
app.use(passport.initialize());
app.use(passport.session());
//create user model
const User = mongoose.model("User", userSchema);
passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//requiring and using flash
const flash = require("connect-flash");
app.use(flash());
//cookie-parser
const cookieParser = require("cookie-parser")
app.use(cookieParser(process.env.SECRET));



//imported self files
const { userValidate, userName } = require("./joi_schema/user_validation");
const { error } = require("./error_class/error_class");
const list_of_invalids = ["$", "<", ">", ";", "\\", "{", "}", "[", "]", "+", "=", "?", "&", ",", ":", "'", "\"", "`"];
const multer = require("multer");
const { cloudinary, storage } = require("./cloudinary");
const { clearCache } = require("ejs");

const create_post_router = require("./routes/create_post");
const home_router = require("./routes/home");

app.listen(3000, () => {
    console.log("Listening on port 3000");
});


app.use((req, res, next) => {
    //for the sleep screen

    if (req.signedCookies.screenPop === undefined) {
        res.cookie("screenPop", true, { signed: true, maxAge: 1000 * 60 * 60 });
        res.locals.sleepScreen = true;
    }
    else {
        res.locals.sleepScreen = false;
    }
    //set isAuthenticated on to ejs
    res.locals.authenticate = req.isAuthenticated();
    //sending req.flash.fail to ejs
    res.locals.fail = req.flash("fail");
    res.locals.error = req.session.flash.error;
    req.session.flash.error = undefined;

    return next();
});


app.route("/login")
    .get((req, res) => {
        res.render("login");
    })
    .post(passport.authenticate("local", { failureFlash: true, failureRedirect: "login" }), (req, res) => {
        if (res.locals.prevUrl !== undefined) {
            res.redirect(res.locals.prevUrl);
        }
        res.redirect("/");
    });



app.route("/register")
    .get((req, res) => {
        res.render("register");
    })
    .post(async (req, res, next) => {
        try {
            const { email, username, password } = req.body;
            console.log(req.body);
            const result = userValidate.validate(req.body);

            if (result.error) {
                // throw new error(401, result.error.message);
                req.flash("fail", result.error.message);
                if (res.locals.prevUrl !== undefined) {
                    res.redirect(res.locals.prevUrl);
                }
                // res.send("registered");
                res.redirect("register");
            }

            for (let i of list_of_invalids) {
                if (username.indexOf(i) !== -1) {
                    // throw new error(401, "username contains invalid characters");
                    req.flash("fail", "username contains invalid characters");
                    if (res.locals.prevUrl !== undefined) {
                        res.redirect(res.locals.prevUrl);
                    }
                    // res.send("registered");
                    res.redirect("register");
                }
                if (password.indexOf(i) !== -1) {
                    // throw new error(401, "password contains invalid characters");
                    req.flash("fail", "password contains invalid characters");

                    if (res.locals.prevUrl !== undefined) {
                        res.redirect(res.locals.prevUrl);
                    }
                    // res.send("registered");
                    res.redirect("register");
                }
                if (email.indexOf(i) !== -1) {
                    // throw new error(401, "email contains invalid characters");
                    req.flash("fail", "email contains invalid characters");
                    if (res.locals.prevUrl !== undefined) {
                        res.redirect(res.locals.prevUrl);
                    }
                    // res.send("registered");
                    res.redirect("register");
                }

            }
            const newUser = new User({ email: email, username: username });

            await User.register(newUser, password);
            req.login(newUser, function (err) {
                // console.log(err);
                if (err) {
                    // throw new error(401, "username is invalid");
                    req.flash("fail", "username is invalid");
                    if (res.locals.prevUrl !== undefined) {
                        res.redirect(res.locals.prevUrl);
                    }
                    // res.send("registered");
                    res.redirect("/");
                }

            });

            if (res.locals.prevUrl !== undefined) {
                res.redirect(res.locals.prevUrl);
            }
            // res.send("registered");
            res.redirect("/");
        }
        catch (e) {
            e.status = e.status === undefined ? 401 : e.status;
            req.flash("fail", e.message);
            if (res.locals.prevUrl !== undefined) {
                res.redirect(res.locals.prevUrl);
            }
            // res.send("registered");
            res.redirect("register");
            // next(e);
        }


    });


const isAllowed = (req, res, next) => {
    console.log(req.isAuthenticated());
    if (req.isAuthenticated() === false) {
        if (req.originalUrl !== "/login" || req.originalUrl !== "/register") {
            res.locals.prevUrl = undefined;
            res.locals.prevUrl = req.originalUrl;

        }
        res.redirect("login");
    }
    else {
        console.log(req.isAuthenticated());

        next();
    }

}
app.use(isAllowed);

app.use("/", home_router);

app.use("/create_post", create_post_router);

app.get("/logout", (req, res) => {

    req.logOut();
    res.redirect("/");
})
app.use((err, req, res, next) => {
    err.status = err.status === undefined ? 400 : err.status;
    res.status(err.status).render("error", { err });
});




