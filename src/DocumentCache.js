"use strict";

var docsPreload = [];

module.exports = {

    docs: docsPreload,

    destroy: function(){
        docsPreload.forEach(function(doc){
            doc.gdImg.destroy();
        });
    },

    preloadDocuments: function(templateMetadataFilePath, templateFilePath){
        
        let templateMetadata = require(templateMetadataFilePath || `../data/templateMetadata.json`);
        
        let gd = require('node-gd');

        let count = 0;
        
        return new Promise(function(resolve, reject){
            templateMetadata.docs.forEach(function(doc){
    
                gd.openJpeg(`${templateFilePath || './data'}/${doc.file}`, function(err, img) {
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