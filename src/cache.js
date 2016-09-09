"use strict";

var root = process.cwd();

var color = require('./color');
var documentClass = require(`${root}/data/documentClass.json`);

var docsPreload = [];

var documents = Object.getOwnPropertyNames(documentClass)
    .map(function(className){
        return {
            className: className,
            file: documentClass[className].file,
            color: color.hexToRGB(documentClass[className].hex)
        };
    });

module.exports = {

    docs: docsPreload,

    destroy: function(){
        docsPreload.forEach(function(doc){
            doc.gdImg.destroy();
        });
    },

    preloadDocuments: function(callback){
        let gd = require('node-gd');

        let count = 0;

        documents.forEach(function(doc){
            gd.openJpeg(`${root}/data/${doc.file}`, function(err, img) {
                if (err)
                    callback(err);

                //todo: optional opt in (move hex color to person handwritting)
                img.grayscale();

                doc.gdImg = img;
                docsPreload.push(doc);

                if(++count === documents.length)
                    callback();
            });
        });
    }
};