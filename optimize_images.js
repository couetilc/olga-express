const sharp = require('sharp'); // Image manipulation library
const listdir = require('path-reader');
const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');

const source_directory = 'static/processed';
const thumbnail_directory = 'static/thumbnails';
const preview_directory = 'static/previews';

// Get all filepaths in directory tree (asynchronously)
let get_files_to_process = listdir.promiseFiles(source_directory, 'file', {
    shortName: 'relative'
});

/* Generate thumbnails and previews of all images contained in directory tree.
 */
get_files_to_process
    .then(files => {
        return new Promise( (resolve, reject) => {
            const include = /\.(jpe?g|png|gif)$/i;
            const exclude = /thumbnail/i;
            const filtered_files = files.filter(file => {
                return include.test(file) && !exclude.test(file);
            });
            resolve(filtered_files);
        });
    })
    .then(files => {
        let pending = [];
        files.forEach(file => {
            pending = pending.concat(createThumbnail(source_directory, thumbnail_directory, file, {
                    width: 200,
                    height: 160
                }));
            pending = pending.concat(createPreview(source_directory, preview_directory, file, {
                    width: 200,
                    height: 160
                }));
        });
        return Promise.all(pending);
    })
    .then(() => console.log("All done!"))
    .catch(err => console.log(err));

/* Resize an image while preserving aspect ratio by cropping at the center to 
 * the provided dimensions.
 * @param {string} srcdir - path to root directory containing imgpath
 * @param {string} dstdir - path to root directory that will hold the thumbnail
 * @param {string} imgpath - path to image relative to srcdir
 * @param {Object} dim - contains data for transformations
 * @param {number} dim.width - minimum width of thumbnail 
 * @param {number} dim.height - minimum height of thumbnail
 * @return {Promise} contains resolution of image creation process
 */
function createThumbnail(srcdir, dstdir, imgpath, dim) {
    return new Promise( (resolve, reject) => {
        const src = path.join(srcdir, imgpath);
        const dst = path.join(dstdir, imgpath);

        /* Ensure directories listed in `dst` exist */
        const dirname = path.dirname(dst);
        mkdirp.sync(dirname);

        /* Create a small jpeg for category thumbnails */
        const img = sharp(src);
        img.jpeg({
                quality: 85,
                progress: true,
                chromeSubsampling: '4:2:2', /* minimal visual difference */
                force: true
            })
            .resize(dim.width, dim.height)
            .crop('center')
            .toFile(dst)
            .then(resolve())
            .catch(err => { console.log(err); reject(err); });
        
    });
}

/* Resize an image to within the provided dimensions while preserving aspect
 * ratio.
 * @param {string} srcdir - path to root directory containing imgpath
 * @param {string} dstdir - path to root directory that will hold the preview
 * @param {string} imgpath - path to image relative to srcdir
 * @param {Object} dim - contains data for transformations
 * @param {number} dim.width - minimum width of preview
 * @param {number} dim.height - minimum height of preview
 * @return {Promise} contains resolution of image creation process
 */
function createPreview(srcdir, dstdir, imgpath, dim) {
    return new Promise( (resolve, reject) => {
        const src = path.join(srcdir, imgpath);
        const dst = path.join(dstdir, imgpath);

        /* Ensure directories listed in `dst` exist */
        const dirname = path.dirname(dst);
        mkdirp.sync(dirname);

        /* Create a small jpeg for category thumbnails */
        const img = sharp(src);
        img.jpeg({
                quality: 85,
                progress: true,
                chromeSubsampling: '4:2:2',
                force: true
            })
            .resize(dim.width, dim.height)
            .min()
            .toFile(dst)
            .then(resolve())
            .catch(err => { console.log(err); reject(err); });
    });
}





























