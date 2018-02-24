const sharp = require('sharp'); // Image manipulation library
const listdir = require('path-reader');
const makepath = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');

const thumbnail_transform = {
    name: 'thumbnails',
    description: "Create a small jpeg for category thumbnails (crop: 200x160)",
    sharp_obj: imgpath => { 
        return sharp(imgpath)
            .jpeg({
                quality: 85,
                progress: true,
                chromeSubsampling: '4:2:2', /* minimal visual difference */
                force: true
            })
            .resize(200, 160)
            .crop('center');
    }
}

const preview_transform = {
    name: 'previews',
    description: "Create a small jpeg for preview thumbnails (min: 200x160)",
    sharp_obj: imgpath => {
        return sharp(imgpath)
            .jpeg({
                quality: 85,
                progress: true,
                chromeSubsampling: '4:2:2',
                force: true
            })
            .resize(200, 160)
            .min();
    }
}

const desktopBG_transform = {
    name: 'desktopBG',
    description: "Create a jpeg for large Desktop screens (min: 1920x1080)",
    sharp_obj: imgpath => {
        return sharp(imgpath)
            .jpeg({
                quality: 85,
                progress: true,
                chromeSubsampling: '4:2:2',
                force: true
            })
            .resize(1920, 1080)
            .withoutEnlargement()
            .min();
    }
}

const optimization_jobs = {
    src_dir: 'static/processed',
    dst_dir: 'static/optimized',
    include_regex: /\.(jpe?g|png|gif|webp)$/i,
    exclude_regex: undefined,
    transforms: [ 
        thumbnail_transform, 
        preview_transform,
        desktopBG_transform,
    ]
}


/* Get all filepaths in directory tree (asynchronously)
 * @param {Object} jobs - Object containing all the information need to 
 *      complete a batch of optimization jobs on a set of images.
 * @param {string} jobs.src_dir - root of directory tree containing all images
 *      that will be optimized.
 * @param {string] jobs.dst_dir - root directory all optimized images will be
 *      written to.
 * @param {RegEx} jobs.include_regex - Regular expression files must match
 *      in order to be optimized.
 * @param {RegEx} jobs.exclude_regex - Regular expression files must not match
 *      in order to be optimized.
 * @param {Array} jobs.transforms - List of transformation objects.
 */
function start_jobs (jobs) {
    return new Promise( (resolve, reject) => {
        listdir.promiseFiles(jobs.src_dir, 'file', {
            shortName: 'relative'
            })
            .then(files => {
                /* Get files to process and filter them based on passed criteria */
                return new Promise( resolve => {
                    const include = jobs.include_regex;
                    const exclude = jobs.exclude_regex;
                    if (jobs.include_regex) {
                        files = files.filter(file => include.test(file));
                    }
                    if (jobs.exclude_regex) {
                        files = files.filter(file => !exclude.test(file));
                    }
                    resolve(files);
                });
            })
            .then(imgpaths => {
                /* Apply optimizations to each image per the transform parameter */
                let pending_jobs = [];
                jobs.transforms.forEach(transform => {
                    imgpaths.forEach(path => {
                        const src = makepath.join(jobs.src_dir, path);
                        const dst = makepath.join(jobs.dst_dir, transform.name, path);
                        const optimization = transform.sharp_obj;

                        pending_jobs = pending_jobs.concat(
                            optimizeImage(src, dst, optimization)
                        );
                    });
                });
                return Promise.all(pending_jobs)
            })
            .then(bools => resolve(bools))
            .catch(err => reject(err));
    });
}

/* Optimize images using a sharp transformation 
 * @param {string} source - Path to image that will be optimized.
 * @param {string} destination - Filepath transformed image will be written to
 * @param {Object} optimization - The sharp transformation to apply to `source`
 * @return {Promise} Status of the optimization operation.
 */
function optimizeImage(source, destination, optimization) {
    return new Promise( (resolve, reject) => {
        /* Ensure directories listed in `destination` exist */
        mkdirp.sync(makepath.dirname(destination));

        /* Apply the sharp transformation to image at `source` */
        optimization(source)
            .toFile(destination)
            .then(resolve(true))
            .catch(err => { console.log(err); reject(err); });
    });
}

start_jobs(optimization_jobs)
    .then(bools => {
        if (bools.every(bool => bool)) {
            console.log("All Succeeded!");
        } else if (bools.every(bool => !bool)) {
            console.log("All failed :(");
        } else {
            console.log("Some failed");
        }
    })
    .catch(err => console.log(err));
