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

            if(doc.form && doc.form.length > 35)
                console.warn(`\n\n\nHEY! doc ${doc.class} has ${doc.form.length} fields`,
                    'node-gd tends to silent fail some text rendering with too many fields or characters',
                    'roughly greater than 425 characters can get the bug.\n\n\n');

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