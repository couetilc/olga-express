const express = require('express');
const router = express.Router();
const _ = require('underscore');
const makepath = require('path');
const fs = require('fs');
const listdir = require('path-reader');

let preview_paths = {};
let thumbnail_paths = {};
let desktopBG_paths = {};
let category_list = ['mixedmedia', 'watercolor', 'ink', 'sketchbook'];

const thumbnail_directory = makepath.join("static", "optimized", "thumbnails");
const preview_directory = makepath.join("static", "optimized", "previews");
const desktopBG_directory = makepath.join("static", "optimized", "desktopBG");
const getRoot = env => env === 'development' ? "/dev/" : "/";


category_list.forEach(category => {
    const category_thumbnails = makepath.join(thumbnail_directory, category);
    const category_previews = makepath.join(preview_directory, category);
    const category_desktopBG= makepath.join(desktopBG_directory, category);
    const listDirectoryFiles = dir => {
        return listdir.files(dir,
            { 
                sync: true,
                shortName: 'relative',
                excludeHidden: true
            }
        );
    };

    thumbnail_paths[category] = listDirectoryFiles(category_thumbnails);
    preview_paths[category] = listDirectoryFiles(category_previews);
    desktopBG_paths[category] = listDirectoryFiles(category_desktopBG);
});

router.route('/')
    .get((req, res, next) => {
        var category = _.sample(category_list);
        res.render('category', { 
            'category': category,
            'preview_uris': _.map(preview_paths[category],
                file => {
                    return makepath.join(getRoot(req.app.get('env')), 
                                        preview_directory, 
                                        category, 
                                        file);
                })
        });
    });

router.route('/:name')
    .get((req, res, next) => {
        res.render('category', {
            'category': req.params.name,
            'preview_uris': _.map(preview_paths[req.params.name],
                file => {
                    return makepath.join(getRoot(req.app.get('env'))
                                        preview_directory, 
                                        req.params.name, 
                                        file);
                })
        });
    });

module.exports = router;
