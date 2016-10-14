"use strict";

var names = require(`../data/names.json`);
const nameCount = names.length;

function randomInt(min, max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}

module.exports = {

    create: function(firstNameSeed, lastNameSeed){

        let f = names[firstNameSeed || randomInt(0, nameCount)];
        let l = names[lastNameSeed || randomInt(0, nameCount)];

        return {
            first: f,
            last: l,
            fullName: `${f} ${l}`,
            contractDate: `${randomInt(1999, 2020)}-${('0'+randomInt(1,12)).slice(-2)}-${('0'+randomInt(1,30)).slice(-2)}`,
            handwriting: {
                angle: Math.random() * .15,
                font: 'future todo',
                size: randomInt(8, 18),
                color: {r: randomInt(0,255), g: randomInt(0,255), b: randomInt(0,255)},
            }
        }
    }
};