var express = require('express');
var router = express.Router();
var _ = require('underscore');
var path = require('path');
var fs = require('fs');

var read_dir = path.join(__dirname, "../public", "processed");
var web_dir = path.join("/static/", "processed");
var category_list = ['mixedmedia', 'watercolor', 'ink', 'sketchbook'];
var category_files = {};

category_list.forEach(category => {
    fs.readdir(path.join(read_dir, category), (err, files) => {
        if (err) {
            category_files[category] = [];
        } else {
            category_files[category] = _.map(files, (file) => 
                path.join(web_dir, category, file));
        }
    })
});

router.param('name', (req, res, next, name) => {
    if (!category_list.includes(name)) {
        req.params = { 
            'category' : '',
            'pic_uris': []
        };
    } else {
        req.params = { 
            'category': name,
            'pic_uris': category_files[name]
        };
    }
    next();
});

router.route('/')
    .get((req, res, next) => {
        var category = _.sample(category_list);
        res.render('category', { 
            'category': category,
            'pic_uris': category_files[category]
        });
    });

router.route('/:name')
    .get((req, res, next) => {
        res.render('category', req.params, (err, html) => {
            console.log(err);
            res.send('hi');   
        });
    });

module.exports = router;
