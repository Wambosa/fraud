"use strict";

var root = process.cwd();

var fs = require('fs');
var gd = require('node-gd');
var cache = require('./src/DocumentCache');

const buildDir = `${root}/build`;
const fontPath = `${root}/fonts/LibreBaskerville-Regular.ttf`;

var gen = null;

main(process.argv.splice(2));

function main(args) {

    if(!fs.existsSync(buildDir))
    	fs.mkdirSync(buildDir);

    cache.preloadDocuments().then(function() {
    	    
    	console.log(`optimal pre-load  of ${cache.docs.length} documents`);
    
        let fileCount = +args[0] || 1;
        let dataGen = args[1] || './example/exampleGenerator.js';
    
        console.log(`BEGIN Image Generation of ${fileCount} ish files using ${dataGen} generator`);
    
        gen = require(dataGen);
        if(!gen)
            return Promise.reject(`problem loading data generator: ${dataGen}`);
    
        return recurseCreate(fileCount).then(function(){
            cache.destroy();
            console.log("done!");
        })
        .catch(console.error); //erase this soon
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

            gd.create(img.width, img.height, function(err, blankImage) {
                if(err)
                    return reject(err);

                img.copy(blankImage, 0, 0, 0, 0, blankImage.width, blankImage.height);

	            let saveName = `${person.first}_${person.last}_${doc.class}`;
	            
	            let appliedRotation = doc.rotation || ["up", "left", "down", "right"][Math.floor(Math.random()*4)];

	            let myPromiseToYou = Promise.resolve();

                if(doc.fields)
                    myPromiseToYou = writeTextOnImage(doc, person, blankImage).then(function(boundingBoxes){
                        return saveMetadata({
                            name: saveName,
                            class: doc.class,
                            rotation: appliedRotation,
                            fields: boundingBoxes.map(function(box){
                                return {
                                    name: box.name,
                                    bounds: rotateBoundingBox(box.bounds, {width: r.width, height: r.height}, appliedRotation)
                                };
                            })
                        });
	                });

	            let r = getRotationConfig(img, appliedRotation);

	            myPromiseToYou.then(function() {
		            gd.create(r.width, r.height, function(err, finalImage){
                        if(err)
                            return reject(err);

			            if(r.type == "vertical")
				            blankImage.copyRotated(finalImage, r.width*.5, r.height*.5, 0, 0, r.width, r.height, r.angle);
			            else
				            blankImage.copyRotated(finalImage, r.width*.5, r.height*.5, 0, 0, r.height, r.width, r.angle);

                        blankImage.destroy();

			            finalImage.saveJpeg(`build/${saveName}.jpg`, 75, function(err) {
				            if(err)
                                return reject(err);

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
    });
}

function getRotationConfig(img, appliedRotation){
    return {
        up: {type: "vertical", angle: 0, width: img.width, height: img.height},
        left: {angle: 90, width: img.height, height: img.width},
        down: {type: "vertical", angle: 180, width: img.width, height: img.height},
        right: {angle: 270, width: img.height, height: img.width}
    }[appliedRotation];
}

function saveMetadata(object){
	return new Promise(function(resolve, reject){
		fs.writeFile(`${buildDir}/${object.name}.json`, JSON.stringify(object), function(err){
			if(err) reject(err);
			else resolve();
		});
	});
}

function writeTextOnImage(doc, person, dest){
	let iPromiseYou = [];

	if(person.handwriting && doc.isColor)
		var textColor = dest.colorAllocate(person.handwriting.color.r, person.handwriting.color.g, person.handwriting.color.b);

	let defaultFontSize = doc.fontSize || 15;
	let sizeDeviation = person.handwriting && person.handwriting.size || 1;
	let angle = person.handwriting && person.handwriting.angle;

	let col = textColor || dest.colorAllocate(0,0,0,1);

	doc.fields.forEach(function(field) {

		iPromiseYou.push(new Promise(function(resolve) {
			dest.stringFT(
				col,
				fontPath,
				field.isHandWritten && (defaultFontSize * sizeDeviation) || defaultFontSize,
				field.isHandWritten && angle || 0,
				field.x,
				field.y,
				''+person[field.name]
			);

			resolve({
				name: field.name,
				bounds: dest.stringFTBBox(
				col,
				fontPath,
				field.isHandWritten && (defaultFontSize * sizeDeviation) || defaultFontSize,
				field.isHandWritten && angle || 0,
				field.x,
				field.y,
				''+person[field.name]
			)});
		}));
	});

	return Promise.all(iPromiseYou);
}


/*
box.bounds = [xll, yll, xlr, ylr, xur, yur, xul, yul]

   xul           xur
yul ._____________. yur
    | Lorem ipsum |
    | dolor sit   |
yll ._____________. ylr
   xll           xlr
   
legend:
xul = x upper left
ylr = y lower right

i only want [xul, yul, xlr, ylr]

returns rotated bounds; relative to the new upper left corner, which could be a problem in some cases
*/
function rotateBoundingBox(bounds, img, appliedRotation){
	return {
		"up": [bounds[6], bounds[7], bounds[2], bounds[3]],
		"left": [bounds[7], img.height - bounds[6], bounds[3], img.height - bounds[2]],
		"down": [img.width - bounds[6], img.height - bounds[7], img.width - bounds[2], img.height - bounds[3]],
		"right": [img.width - bounds[7], bounds[6], img.width - bounds[3], bounds[2]]
	}[appliedRotation];
}