"use strict";

var root = process.cwd();

var fs = require('fs');
var gd = require('node-gd');
var cache = require('./src/DocumentCache');

const buildDir = `${root}/build`;
const fontPath = `${root}/fonts/LibreBaskerville-Regular.ttf`;

var gen = null;

if(!fs.existsSync(buildDir))
	fs.mkdirSync(buildDir);

cache.preloadDocuments(function(err) {
	if(err) throw err;
	console.log(`optimal pre-load  of ${cache.docs.length} documents`);
	main(process.argv.splice(2));
});

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

	            let rotations = {
		            up: {type: "vertical", angle: 0, width: img.width, height: img.height},
		            left: {angle: 90, width: img.height, height: img.width},
		            down: {type: "vertical", angle: 180, width: img.width, height: img.height},
		            right: {angle: 270, width: img.height, height: img.width}
	            };

	            let appliedRotation = doc.rotation || ["up", "left", "down", "right"][Math.floor(Math.random()*4)];
	            let r = rotations[appliedRotation];

	            let myPromiseToYou = Promise.resolve();

                if(doc.fields)
	                myPromiseToYou = writeTextOnImage(doc, person, dest).then(function(boundingBoxes){
			                return saveMetadata({
				                name: saveName,
				                class: doc.class,
				                rotation: appliedRotation,
				                fields: boundingBoxes.map(function(box){
					                return rotateBoundingBox(box, {width: r.width, height: r.height}, appliedRotation);
				                })
			                });
	                });

	            myPromiseToYou.then(function() {
		            gd.create(r.width, r.height, function(err, finalImage){

			            if(r.type == "vertical")
				            dest.copyRotated(finalImage, r.width*.5, r.height*.5, 0, 0, r.width, r.height, r.angle);
			            else
				            dest.copyRotated(finalImage, r.width*.5, r.height*.5, 0, 0, r.height, r.width, r.angle);

			            dest.destroy();

			            finalImage.saveJpeg(`build/${saveName}.jpg`, 75, function(err) {
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
    });
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

	let col = textColor || dest.colorAllocate(255,0,0,1);

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

function rotateBoundingBox(box, img, appliedRotation){
	//we only want the top-left XY then bottom-right XY
	//note: this is relative. would be better if it perfectly represented the after rotated version
	let adjusted = {
		"up": [box.bounds[6], box.bounds[7], box.bounds[2], box.bounds[3]],
		"left": [box.bounds[7], img.height - box.bounds[6], box.bounds[3], img.height - box.bounds[2]],
		"down": [img.width - box.bounds[6], img.height - box.bounds[7], img.width - box.bounds[2], img.height - box.bounds[3]],
		"right": [img.width - box.bounds[7], box.bounds[6], img.width - box.bounds[3], box.bounds[2]]
	}[appliedRotation];

	return {
		name: box.name,
		bounds: adjusted
	};
}