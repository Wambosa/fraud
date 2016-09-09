"use strict";

var root = process.cwd();

var hexHash = {
    A: 10,
    B: 11,
    C: 12,
    D: 13,
    E: 14,
    F: 15
};

function hexToRGB(hexCode){

    if(hexCode.length != 6)
        console.error(`hexcode ${hexCode} is invalid. hint: ${root}/data/documentClass.json`);

    let rCode = hexCode.substr(0,2).toUpperCase();
    let gCode = hexCode.substr(2,2).toUpperCase();
    let bCode = hexCode.substr(4,2).toUpperCase();

    let rVal = (hexHash[rCode[0]] || rCode[0]) * 16 + +(hexHash[rCode[1]] || rCode[1]);
    let gVal = (hexHash[gCode[0]] || gCode[0]) * 16 + +(hexHash[gCode[1]] || gCode[1]);
    let bVal = (hexHash[bCode[0]] || bCode[0]) * 16 + +(hexHash[bCode[1]] || bCode[1]);
    return {
        r: +rVal,
        g: +gVal,
        b: +bVal
    }
}

module.exports = {
    hexToRGB: hexToRGB
};