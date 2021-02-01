const express = require("express");
const router = express.Router();
//for files
const fs = require("fs");
const { nextTick } = require("process");
const file = require("../classes/article_file");
//for file storage
const multer = require("multer");
const { cloudinary, storage } = require("../cloudinary");
//for session
const session = require("express-session");
//error class
const { error } = require("../error_class/error_class");
router.route("/")
    .get((req, res) => {
        res.render("choose_template");

    });

router.route("/new")
    .post((req, res) => {
        let date = new Date().toLocaleDateString("en-US").split("/");
        const newArticle = new file(req.body.text, date, "", req.body.template);
        req.session.article = newArticle;
        res.redirect("/create_post/new");
    })
    .get((req, res, next) => {
        if (req.session.article !== undefined) {

            res.render("article_writeUp", { article: req.session.article });
        }
        throw (new error("Article does not exist", 400));
    });

module.exports = router;