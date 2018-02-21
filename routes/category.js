var express = require('express');
var router = express.Router();
var _ = require('underscore');
var path = require('path');
var fs = require('fs');

let read_dir = path.join(__dirname, "../public", "processed");
let web_dir = path.join("/static/", "processed");
let category_list = ['mixedmedia', 'watercolor', 'ink', 'sketchbook'];
let category_files = {};

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
        req.params.data  = { 
            'category' : '',
            'pic_uris': []
        };
    } else {
        req.params.data = { 
            'category': name,
            'pic_uris': category_files[name]
        };
    }
    next();
});

router.route('/')
    .get((req, res, next) => {
        let name = _.sample(category_list);
        res.render('category', { 
            'category': name,
            'pic_uris': category_files[name]
        });
    });

router.route('/:name')
    .get((req, res, next) => {
        res.render('category', { 
            'category': req.params.data.category,
            'pic_uris': category_files[req.params.data.category]
        });
    });

module.exports = router;
