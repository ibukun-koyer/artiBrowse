//requiring joi
const joi = require("joi");
const { userValidate, userName } = require("../joi_schema/user_validation");
const { error } = require("../error_class/error_class");
const list_of_invalids = ["$", "<", ">", ";", "\\", "{", "}", "[", "]", "+", "=", "?", "&", ",", ":", "'", "\"", "`"];
const mongoose = require("mongoose");
const { userSchema } = require("../schema/userSchema");
const User = mongoose.model("User", userSchema);
const express = require("express");
const multer = require("multer");
const { cloudinary, storage } = require("../cloudinary");
const router = express.Router();
router.get("/", (req, res) => {
    console.log(req.user);
    const { user } = req;
    res.render("home", { user });

})
router.route("/update_quote")
    .post(async (req, res, next) => {
        let max = process.env.MAX_LENGTH_QUOTE;
        try {
            if (req.body.quote.length > max) {
                // throw new error(400, `request is invalid, please enter a quote with ${max} amount of characters`);
                req.flash("fail", `request is invalid, please enter a quote with ${max} amount of characters`);
                if (res.locals.prevUrl !== undefined) {
                    res.redirect(res.locals.prevUrl);
                }
                // res.send("registered");
                res.redirect("/");
            }
            await User.findOneAndUpdate({ username: req.user.username }, { $set: { quote: req.body.quote } });
            res.redirect("/");
        }
        catch (e) {
            e.status = e.status === undefined ? 401 : e.status;
            req.flash("fail", e.message);
            if (res.locals.prevUrl !== undefined) {
                res.redirect(res.locals.prevUrl);
            }
            // res.send("registered");
            res.redirect("/");
            // next(e);
        }
    });
router.route("/update_username")
    .post(async (req, res, next) => {
        try {
            const result = userName.validate(req.body.username);

            if (result.error) {
                // throw new error(401, result.error.message);
                req.flash("fail", result.error.message);
            }
            for (let i of list_of_invalids) {
                if (req.body.username.indexOf(i) !== -1) {
                    // next(new error(401, "username contains invalid characters"));
                    req.flash("fail", "username contains invalid characters");
                    if (res.locals.prevUrl !== undefined) {
                        res.redirect(res.locals.prevUrl);
                    }
                    // res.send("registered");
                    res.redirect("/");
                }
            }
            console.log(req.body.user);
            const changed = await User.findOneAndUpdate({ username: req.user.username }, { $set: { username: req.body.username } }, { new: true });

            req.login(changed, function (err) {
                // console.log(err);
                if (err) {
                    console.dir(err);
                    // throw new error(401, "username is invalid");
                    req.flash("fail", "username contains invalid characters");
                    if (res.locals.prevUrl !== undefined) {
                        res.redirect(res.locals.prevUrl);
                    }
                    // res.send("registered");
                    res.redirect("/");
                }

            });
            res.redirect("/");
        }
        catch (e) {
            e.status = e.status === undefined ? 401 : e.status;
            req.flash("fail", "username belongs to another user");
            if (res.locals.prevUrl !== undefined) {
                res.redirect(res.locals.prevUrl);
            }
            // res.send("registered");
            res.redirect("/");
            // next(e);
        }
    });
router.route("/update_pp")
    .post((req, res) => {
        let num_kb = process.env.MAX_PIX;
        let upload = multer({
            storage,
            limits: { fileSize: 1024 * num_kb }
        }).single("image");
        upload(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                req.flash("fail", err.message + `, please enter an image with a max-size of 512kb`);
                return res.redirect("/");
            } else if (err) {
                req.flash("fail", err.message);
                return res.redirect("/");

            }
            // Everything went fine.
            const { filename, path } = req.file;
            if (req.user.image.filename !== "") {
                await cloudinary.uploader.destroy(req.user.image.filename);
            }
            const ret = await User.findOneAndUpdate({ username: req.user.username }, { $set: { image: { filename: filename, path: path } } });
            return res.redirect("/");
        });

    });



module.exports = router;

