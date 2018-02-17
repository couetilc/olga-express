var express = require('express');
var router = express.Router();

/* GET home page. */
router.route('/')
    .get((req, res, next) => {
        res.render('index', 
            {   title: 'Olga Anastasia Art',
                style: 'static/css/index.css'
            }, 
            (err, html) => {
                /* Handle errors then send html response */
                res.send(html);
            }
        );
    });

module.exports = router;
