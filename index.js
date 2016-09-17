"use strict";

var root = process.cwd();
var fs = require('fs');

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

function windowsRun(fileCount){
    fileCount = +fileCount || 1;

    console.log(`BEGIN Image Replication of ${fileCount} ish files`);

    recurseReplicate(fileCount)
        .then(function(){
            console.log("done!");
        })
        .catch(console.error);
}

function recurseCreate(countDown){

    if(countDown <= 0){

        return Promise.resolve();
    }

    return new Promise(function(resolve, reject){

        let p = person.create();

        let savedFiles = 0;

        p.docs.forEach(function(doc){
            let img = doc.gdImg;

            gd.create(img.width, img.height, function(err, dest) {

                img.copy(dest, 0, 0, 0, 0, dest.width, dest.height);

                var textColor = dest.colorAllocate(doc.color.r, doc.color.g, doc.color.b);

                dest.stringFT(
                    textColor,
                    fontPath,
                    (dest.width+dest.height*.5) * .015,
                    p.handwriting,
                    Math.round(dest.width * .5),
                    Math.round(dest.height * .5),
                    `${p.first} ${p.last}'s ${doc.className}`
                );

                let saveName = `${p.first}_${p.last}_${doc.className}`;
                let fileExt = 'jpg';

                dest.saveJpeg(`build/${saveName}.${fileExt}`, 75, function(err) {
                    if(err)
                        reject(err);

                    console.log(`saved: ${saveName}`);
                    dest.destroy();

                    if(++savedFiles === p.docs.length){
                        console.log(`${(countDown - p.docs.length)} files left to go`);
                        resolve(recurseCreate(countDown - p.docs.length));
                    }
                });
            });
        });
    });
}

function recurseReplicate(countDown){

    if(countDown <= 0){

        return Promise.resolve();
    }

    return new Promise(function(resolve, reject){

        let p = person.create();

        let savedFiles = 0;

        p.docs.forEach(function(doc){

            let saveName = `${p.first}_${p.last}_${doc.className}${path.extname(doc.file)}`;

            let original = fs.createReadStream(`data/${doc.file}`);
            original.pipe(fs.createWriteStream(`build/${saveName}`));

            original.on('close', function(){
                if(++savedFiles === p.docs.length){
                    console.log(`${(countDown - p.docs.length)} files left to go`);
                    resolve(recurseReplicate(countDown - p.docs.length));
                }
            });

            original.on('error', function(e){
                reject(e);
            });
        });
    });
}


if (!fs.existsSync(buildDir))
    fs.mkdirSync(buildDir);


if(!/^win/.test(process.platform)){
    var gd = require('node-gd');
    var cache = require('./src/cache');
    var person = require(`./src/person`).with(cache);

    cache.preloadDocuments(function(err){
        if(err) throw err;

        console.log("preloaded documents...");
        main(process.argv.splice(2));
    });

}else{

    console.log("looks like you are running on windows");
    var path = require('path');
    var person = require(`./src/person`);
    windowsRun(process.argv.splice(2));
}