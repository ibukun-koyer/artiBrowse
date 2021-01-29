const express = require("express");
const router = express.Router();
router.route("/")
    .get((req, res) => {
        res.render("choose_template");

    });

router.post("/new", (req, res) => {
    res.send(req.body);
})
module.exports = router;