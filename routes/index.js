var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
router.route('/')
    .get((req, res, next) => {
        res.render("index");
    });

module.exports = router;
