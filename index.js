"use strict";

var root = process.cwd();

var fs = require('fs');
var gd = require('node-gd');
var cache = require('./src/DocumentCache');
var personGen = require(`./src/PersonGenerator`);

const buildDir = `${root}/build`;
const fontPath = `${root}/data/LibreBaskerville-Regular.ttf`;

function main(fileCount){

    fileCount = +fileCount || 1;

    console.log(`BEGIN Image Generation of ${fileCount} ish files`);

    recurseCreate(fileCount)
        .then(function(){

            cache.destroy();
            console.log("done!");
        })
        .catch(console.error);
}

function recurseCreate(countDown){

    if(countDown <= 0)
        return Promise.resolve();

    return new Promise(function(resolve, reject){

        let p = personGen.create();

        let savedFiles = 0;

        cache.docs.forEach(function(doc){
            let img = doc.gdImg;

            gd.create(img.width, img.height, function(err, dest) {

                img.copy(dest, 0, 0, 0, 0, dest.width, dest.height);

                if(doc.isColor)
                    var textColor = dest.colorAllocate(p.handwriting.color.r, p.handwriting.color.g, p.handwriting.color.b);

                if(doc.form){
                    doc.form.forEach(function(field){
                        dest.stringFT(
                            textColor || dest.colorAllocate(0,0,0),
                            fontPath,
                            p.handwriting.size,
                            p.handwriting.angle,
                            field.x,
                            field.y,
                            p[field.property]
                        );
                    });
                }

                let saveName = `${p.first}_${p.last}_${doc.class}`;
                let fileExt = 'jpg';

                dest.saveJpeg(`build/${saveName}.${fileExt}`, 75, function(err) {
                    if(err)
                        reject(err);

                    console.log(`saved: ${saveName}`);
                    dest.destroy();

                    if(++savedFiles === cache.docs.length){
                        console.log(`${(countDown - cache.docs.length)} files left to go`);
                        resolve(recurseCreate(countDown - cache.docs.length));
                    }
                });
            });
        });
    });
}

if(!fs.existsSync(buildDir))
    fs.mkdirSync(buildDir);

cache.preloadDocuments(function(err){
    if(err) throw err;

    console.log("pre-loaded documents...");
    main(process.argv.splice(2));
});