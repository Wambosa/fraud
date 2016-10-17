"use strict";

var root = process.cwd();

var fs = require('fs');
var gd = require('node-gd');
var cache = require('./src/DocumentCache');
var personGen = require(`./example/exampleGenerator`);

const buildDir = `${root}/build`;
const fontPath = `${root}/fonts/LibreBaskerville-Regular.ttf`;

var gen = null;

function main(args){

    let fileCount = +args[0] || 1;
    let dataGen = args[1] || './example/exampleGenerator.js';

    console.log(`BEGIN Image Generation of ${fileCount} ish files using ${dataGen} generator`);

    gen = require(dataGen);
    if(!gen)
        throw `problem loading data generator: ${dataGen}`;

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

        let p = gen.generate();

        let savedFiles = 0;

        cache.docs.forEach(function(doc){
            let img = doc.gdImg;

            gd.create(img.width, img.height, function(err, dest) {

                img.copy(dest, 0, 0, 0, 0, dest.width, dest.height);

                if(doc.form){

                    if(p.handwriting && doc.isColor)
                        var textColor = dest.colorAllocate(p.handwriting.color.r, p.handwriting.color.g, p.handwriting.color.b);

                    let defaultFontSize = doc.form.fontSize || 15;
                    let sizeDeviation = p.handwriting && p.handwriting.size || 1;
                    let angle = p.handwriting && p.handwriting.angle;

                    doc.form.forEach(function(field){
                        dest.stringFT(
                            textColor || dest.colorAllocate(0,0,0),
                            fontPath,
                            field.isWritten && (defaultFontSize * sizeDeviation) || defaultFontSize,
                            field.isWritten && angle || 0,
                            field.x,
                            field.y,
                            ''+p[field.property]
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