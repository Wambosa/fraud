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

    preloadDocuments: function(callback){
        let gd = require('node-gd');

        let count = 0;

        templateMetadata.docs.forEach(function(doc){
            gd.openJpeg(`./data/${doc.file}`, function(err, img) {
                if (err)
                    callback(err);

                if(!doc.isColor)
                    img.grayscale();

                doc.gdImg = img;
                docsPreload.push(doc);

                if(++count === templateMetadata.docs.length)
                    callback();
            });
        });
    }
};