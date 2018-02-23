const sharp = require('sharp');

input_jpg = 'background.jpg';

const img = sharp(input_jpg);
/*
img.metadata()
    .then(metadata => {
        console.log(metadata);
        return img.stats();
    })
    .then(stats => { console.log(stats);
    });
*/

img
    .jpeg({
        quality: 85,
        progressive: true,
        chromeSubsampling: '4:2:2', /* Minimal visual difference */
        force: true
    })
    .resize(200, 160)
    .toFile('test.jpg')
    .then(() => console.log("success"))
    .catch(() => console.log("failure"));

/*













sharp('input.jpg')
    .resize(300, 200)
    .toFile('output.jpg', err => {

    });

var transformer = sharp()
    .resize(300)
    .on('info', info => {
        console.log('Image height is ' + info.height);
    });
readableStream.pipe(transformer).pipe(writableStream);

sharp({
    create: {
        width: 300,
        height: 200,
        channels: 4,
        background: { r: 255, g: 0, b: 0, alpha: 128 }
    }
})
.png()
.toBuffer()
.then();

sharp.queue.on('change', queueLength => {
    console.log('Queue contains ' + queueLength + ' task(s)');
});


const pipeline = sharp().rotate();
pipeline.clone().resize(800, 600).pipe(firstWritableStream);
pipeline.clone().extract({ left: 20, top: 20, width: 100, height: 100 }).pipe(secondWritableStream);
readableStream.pipe(pipeline);


const image = sharp(inputJpg);
image
    .metadata()
    .then(metadata => {
        return image
            .resize(Math.round(metadata.width / 2))
            .webp()
            .toBuffer();
    })
    .then(data => {
        //data contains a WebP image
    });
*/
