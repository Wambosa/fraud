"use strict";

var root = process.cwd();

var fs = require('fs');
var gd = require('node-gd');
var cache = require('./src/DocumentCache');

const buildDir = `${root}/build`;
const fontPath = `${root}/fonts/LibreBaskerville-Regular.ttf`;

var gen = null;

function main(args) {

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

function recurseCreate(countDown) {

    if(countDown <= 0)
        return Promise.resolve();

    return new Promise(function(resolve, reject) {

        let person = gen.generate();

        let savedFiles = 0;

        cache.docs.forEach(function(doc) {
            let img = doc.gdImg;

            gd.create(img.width, img.height, function(err, dest) {

                img.copy(dest, 0, 0, 0, 0, dest.width, dest.height);

	            let saveName = `${person.first}_${person.last}_${doc.class}`;

                if(doc.form) {

                    if(person.handwriting && doc.isColor)
                        var textColor = dest.colorAllocate(person.handwriting.color.r, person.handwriting.color.g, person.handwriting.color.b);

                    let defaultFontSize = doc.fontSize || 15;
                    let sizeDeviation = person.handwriting && person.handwriting.size || 1;
                    let angle = person.handwriting && person.handwriting.angle;

	                let charCount = 0;
                    doc.form.forEach(function(field) {
	                    charCount += (''+person[field.name]).length;

                        dest.stringFT(
                            textColor || dest.colorAllocate(0,0,0),
                            fontPath,
                            field.isHandWritten && (defaultFontSize * sizeDeviation) || defaultFontSize,
                            field.isHandWritten && angle || 0,
                            field.x,
                            field.y,
                            ''+person[field.name]
                        );
                    });

	                if(charCount >= 425)
	                    console.log(`WARN: ${saveName} char render count is ${charCount}`);
                }
                
                
                let rotations = [
                    {name: "up", type: "vertical", angle: 0, width: img.width, height: img.height},
                    {name: "left", angle: 90, width: img.height, height: img.width},
                    {name: "down", type: "vertical", angle: 180, width: img.width, height: img.height},
                    {name: "right", angle: 270, width: img.height, height: img.width}
                ];
                
                let r = rotations[Math.floor(Math.random()*4)];
                
                gd.create(r.width, r.height, function(err, finalImage){
                    
                    if(r.type == "vertical")
                        dest.copyRotated(finalImage, r.width*.5, r.height*.5, 0, 0, r.width, r.height, r.angle);
                    else
                        dest.copyRotated(finalImage, r.width*.5, r.height*.5, 0, 0, r.height, r.width, r.angle);

                    let fileExt = 'jpg';
    
                    finalImage.saveJpeg(`build/${saveName}.${fileExt}`, 75, function(err) {
                        if(err)
                            reject(err);
    
                        console.log(`saved: ${saveName}`);
                        finalImage.destroy();
    
                        if(++savedFiles === cache.docs.length) {
                            console.log(`${(countDown - cache.docs.length)} files left to go`);
                            resolve(recurseCreate(countDown - cache.docs.length));
                        }
                    });

                });



            });
        });
    });
}

if(!fs.existsSync(buildDir))
    fs.mkdirSync(buildDir);

cache.preloadDocuments(function(err) {
    if(err) throw err;

    console.log("pre-loaded documents...");
    main(process.argv.splice(2));
});