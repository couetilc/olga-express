var express = require('express');
var router = express.Router();

var category_list = ['mixedmedia', 'ink'];

router.param('name', (req, res, next, name) => {
    req.params = { 'category': name };
    next();
});

/* GET <rootURL>/category/* */
router.route('/:name')
    .get((req, res, next) => {
        /* html contains the rendered string.
         * Because the callback function is included, html is not
         * automatically sent and the opportunity to handle errors is 
         * provided.*/
        res.render('category', req.params, (err, html) => {
            res.send(html);
        });
    });

module.exports = router;
