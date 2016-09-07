"use strict";

var root = process.cwd();

var gd = require('node-gd');
var person = require(`${root}/src/person`);

function main(fileLimit){

    fileLimit = +fileLimit || 5;

    console.log(`BEGIN Image Generation of ${fileLimit} ish files`);

    let openedFileCount = 0;

    while(openedFileCount < fileLimit){

        let p = person.create();

        p.docs.forEach(function(doc){

            openedFileCount++;

            gd.openJpeg(`${root}/data/${doc.file}`, function(err, img) {
                if (err) {
                    console.error(`read fail: ${root}/data/${doc.file}`);
                    throw err;
                }

                var txtColor = img.colorAllocate(doc.color.r, doc.color.g, doc.color.b);

                var fontPath = `${root}/data/LibreBaskerville-Regular.ttf`;

                img.stringFT(
                    txtColor,
                    fontPath,
                    (img.width+img.height*.5) * .05,
                    p.handwriting,
                    Math.round(img.width * .5),
                    Math.round(img.height * .5),
                    `${p.first} ${p.last}'s ${doc.className}`
                );

                let saveName = `${p.first}_${p.last}_${doc.className}`;
                let fileExt = 'png';

                img.savePng(`build/${saveName}.${fileExt}`, 1, function(err) {
                    if(err) throw err;

                    console.log(`saved: ${saveName}.${fileExt}`);
                });

                img.destroy();
            });
        });
    }
}

main(process.argv.splice(2));