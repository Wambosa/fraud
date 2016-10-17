"use strict";

var names = require(`../data/names.json`);
var cities = require('../data/cities.json');
var states = require('../data/states.json');

function randomInt(min, max) {return Math.floor(Math.random()*(max-min+1)+min);}

function randName(){
    return names[randomInt(0, names.length-1)];
}

function randDate(){
    return `${randomInt(1999, 2020)}-${('0'+randomInt(1,12)).slice(-2)}-${('0'+randomInt(1,30)).slice(-2)}`;
}

function randCity(){
    return cities[randomInt(0, cities.length-1)];
}

function randState(){
    return states[randomInt(0, states.length-1)];
}

function randAddress() {
    return `${randomInt(123, 9123)} ${randName()} st,\n ${randCity()}, ${randState()} ${randomInt(10000, 99999)}`;
}

function randPhone(){
    return `${randomInt(801, 999)}-${randomInt(801, 999)}-${randomInt(1000, 9999)}`;
}

module.exports = {
    create: function(){

        let first = randName();
        let last = randName();
        let fullName = `${first} ${last}`;
        let appId = "";
        for(let i=0; i < fullName.length; i++)
            appId += fullName.charAt(i).charCodeAt(0);

        let seller = {
            name: randName(),
            address: randAddress(),
            phone: randPhone()
        };

        let vehicle = {
            cost: randomInt(10000, 25000),
            year: randomInt(2010, 2020),
            make: 'Ford', // todo: random list these
            model: 'Fusion',
            odometer: randomInt(0,100000),
            vin: randomInt(9999999999999999999999999, 9999999999999999999999999999).toString(36).slice(0, 17).toUpperCase(),
            color: ['RED', 'BLK', 'WHT', 'BLUE'][randomInt(0, 3)],
            licenseNo: randomInt(9999999999, 999999999999999).toString(36).slice(-7).toUpperCase(),
            isPersonal: 'X'
        };
        vehicle.newUsed = vehicle.odometer < 30000 ? 'NEW': 'USED';

        let loan = {
            rate: randomInt(15, 35),
            term: [48, 60, 72][randomInt(0, 2)],
            down: randomInt(0, 5000)
        };
        loan.financed = vehicle.cost - loan.down;
        loan.financeCharge = (loan.financed * (loan.rate*.01)) * (loan.term/12);


        return {
            dealerNumber: randomInt(100000, 999999),
            contractNumber: appId.slice(0, 8),
            rosNumber: randomInt(1000, 9990),
            stockNumber: randomInt(1, 100),

            fullName: fullName,
            address: randAddress(),
            phone: randPhone(),

            sellerName: seller.name,
            sellerAddress: seller.address,
            sellerPhone: seller.phone,

            vehicleNewUsed: vehicle.newUsed,
            vehicleYear: vehicle.year,
            vehicleMake: vehicle.make,
            vehicleModel: vehicle.model,
            vehicleOdometer: vehicle.odometer,
            vehicleVin: vehicle.vin,
            vehicleColor: vehicle.color,
            vehicleLicenseNo: vehicle.licenseNo,
            vehicleIsPersonal: vehicle.isPersonal,

            first: first,
            last: last,
            contractDate: randDate(),
            handwriting: {
                angle: randomInt(-4, 4) * .025,
                font: 'future todo',
                size: randomInt(3, 12) * .1,
                color: {r: randomInt(0,255), g: randomInt(0,255), b: randomInt(0,255)},
            }
        }
    }
};