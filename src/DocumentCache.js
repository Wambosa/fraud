"use strict";

var templateMetadata = require(`../data/templateMetadata.json`);

var docsPreload = [];

module.exports = {

    docs: docsPreload,

    destroy: function(){
        docsPreload.forEach(function(doc){
            doc.gdImg.destroy();
        });
    },

    preloadDocuments: function(){
        let gd = require('node-gd');

        let count = 0;
        
        return new Promise(function(resolve, reject){
            templateMetadata.docs.forEach(function(doc){
    
                gd.openJpeg(`./data/${doc.file}`, function(err, img) {
                    if(err)
                        return reject(err);
    
                    if(!doc.color)
                        img.grayscale();
    
                    doc.gdImg = img;
                    docsPreload.push(doc);
    
                    if(++count === templateMetadata.docs.length)
                        resolve();
                });
            });
        });
    }
};