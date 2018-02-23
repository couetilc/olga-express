const express = require('express');
const router = express.Router();
const _ = require('underscore');
const path = require('path');
const fs = require('fs');
const listdir = require('path-reader');

const thumbnail_directory = path.join("static", "thumbnails");
const preview_directory = path.join("static", "previews");
let preview_paths = {};
let thumbnail_paths = {};
let category_list = ['mixedmedia', 'watercolor', 'ink', 'sketchbook'];

category_list.forEach(category => {
    const pdir = path.join("static", "previews", category);
    const tdir = path.join("static", "previews", category);
    const listDirectoryFiles = dir => {
        return listdir.files(dir,
            { 
                sync: true,
                shortName: 'relative',
                excludeHidden: true
            }
        );
    };

    preview_paths[category] = listDirectoryFiles(pdir);
    thumbnail_paths[category] = listDirectoryFiles(tdir);

    /*
    listDirectoryFiles(pdir)
        .then(files => {
            preview_paths[category] = files;
            return listDirectoryFiles(tdir);
        })
        .then(files => {
            thumbnail_paths[category] = files;
        })
        .catch(err => console.log(err));
    */
});

router.route('/')
    .get((req, res, next) => {
        var category = _.sample(category_list);
        res.render('category', { 
            'category': category,
            'pic_uris': _.map(preview_paths[category],
                file => {
                    return path.join("/static", "previews", category, file);
                })
        });
    });

router.route('/:name')
    .get((req, res, next) => {
        res.render('category', {
            'category': req.params.name,
            'pic_uris': _.map(preview_paths[req.params.name],
                file => {
                    return path.join("/static", "previews", req.params.name, file);
                })
        });
    });

module.exports = router;
