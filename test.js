const fpath = require('path');
const listdir = require('path-reader');
const _ = require('underscore');

const category_list = {
    'mixedmedia': {}, 
    'watercolor': {}, 
    'ink': {}, 
    'sketchbook': {}
};
images = _.mapObject({   
    'preview': {}, 
    'desktopBG': {}, 
    'thumbnail': {}, 
    'original': {}
}, () => category_list);

const static_dir = fpath.join('static', 'optimized');

_.mapObject(images, (type, t) => {
    _.mapObject(type, (category, c) => {
        const listDirectoryFiles = dir => {
            return listdir.files(dir,
                {
                    sync: true,
                    shortName: 'relative',
                    excludeHidden: true
                }
            );
        };

        const category_dir = fpath.join(static_dir, t, c);
        images[t][c].srcdir = category_dir;
        images[t][c].paths = listDirectoryFiles(category_dir);
    });
});

console.log('complete');
console.log(images);
