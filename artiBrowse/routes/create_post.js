const express = require("express");
const router = express.Router();
router.route("/")
    .get((req, res) => {
        res.render("choose_template");

    });
module.exports = router;