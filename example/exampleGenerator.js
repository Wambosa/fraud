"use strict";

var names = require(`./names.json`);
var cities = require('./cities.json');
var states = require('./states.json');

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
    generate: function(){

        let first = randName();
        let last = randName();
        let fullName = `${first} ${last}`;
        let appId = "";
        for(let i=0; i < fullName.length; i++)
            appId += fullName.charAt(i).charCodeAt(0);
	    let ssn = randomInt(100, 999)+'-'+randomInt(10, 99)+'-'+randomInt(1000, 9999);

	    let driversLicense = {
		    id: randomInt(100000, 999999),
		    class: ['A', 'B', 'C', 'C', 'D', 'E'][randomInt(0, 5)],
		    issuedOn: randDate(),
		    expireOn: randDate(),
		    birth: randDate(),
		    address: randAddress(),
		    restriction: ['NONE', 'NONE', 'NONE', 'A', 'B', 'C', 'D', 'E'][randomInt(0, 7)],
		    height: randomInt(4,6)+'-'+randomInt(1, 11),
		    dd: randomInt(10000000000000000000, 99999999999999999999),
		    sex: ['M', 'F', '?'][randomInt(0,2)],
		    eyes: ['BRO', 'BLK', 'RED', 'BLU', 'GRN', 'YEL'][randomInt(0, 5)]
	    };

        let seller = {
            name: randName(),
            address: randAddress(),
            phone: randPhone()
        };

        let vehicle = {
            cost: randomInt(10000, 25000),
            year: randomInt(2010, 2020),
            make: ['FORD', 'TOYOTA', 'HONDA', 'BMW'][randomInt(0, 3)],
            model: ['Commuter', 'Racer', 'Worker', 'Abductor'][randomInt(0, 3)],
            odometer: randomInt(0,100000),
            vin: randomInt(9999999999999999999999999, 9999999999999999999999999999).toString(36).slice(0, 17).toUpperCase(),
            color: ['RED', 'BLK', 'WHT', 'BLUE'][randomInt(0, 3)],
            licenseNo: randomInt(9999999999, 999999999999999).toString(36).slice(-7).toUpperCase(),
            isPersonal: 'X'
        };
        vehicle.newUsed = vehicle.odometer < 30000 ? 'NEW': 'USED';

        let loan = {
            rate: randomInt(5, 30),
            term: [48, 60, 72][randomInt(0, 2)],
            down: randomInt(0, 9500),
	        payment: 0
        };
        loan.financed = vehicle.cost - loan.down;
        loan.financeCharge = loan.financed * ( ((loan.rate * .01)/12) * loan.term);
	    loan.payment = (loan.financed + loan.financeCharge + loan.down) / loan.term;

	    let insurance = {
		    policyNumber: randomInt(1000000000, 9999999999),
		    naic: randomInt(10000, 99999),
		    effectiveDate: randDate(),
		    expiration: randDate(),
		    deductable: randomInt(500, 5000),
		    collision: randomInt(0, 10000),
		    injury: randomInt(0, 10000),
		    damage: randomInt(0, 10000),
		    premium: randomInt(0, 1000),
		    seller: `${randCity()} Insurance ${randomInt(0,10) > 6 ? 'Scam' : ''}`,
		    signature: fullName
	    };

	    let coBuyer = {
		    fullName: '',
		    contactInfo: ''
	    };

	    if(loan.rate > 19){
		    coBuyer.fullName = `${randName()} ${randName()}`;
		    coBuyer.contactInfo = `${coBuyer.fullName}\n${randAddress()}\n${randPhone()}`;
	    }

        return {
            dealerNumber: randomInt(100000, 999999),
            contractNumber: appId.slice(0, 8),
            rosNumber: randomInt(1000, 9990),
            stockNumber: randomInt(1, 100),

            first: first,
            last: last,
            fullName: fullName,

	        buyerContact: `${fullName}\n${driversLicense.address}\n${randPhone()}`,
	        coBuyerContact: coBuyer.contactInfo,
            sellerContact: `${seller.name}\n${seller.address}\n${seller.phone}`,

            vehicleNewUsed: vehicle.newUsed,
            vehicleYear: vehicle.year,
            vehicleMake: vehicle.make,
            vehicleModel: vehicle.model,
            vehicleOdometer: vehicle.odometer,
            vehicleVin: vehicle.vin,
            vehicleColor: vehicle.color,
            vehicleLicenseNo: vehicle.licenseNo,
            vehicleIsPersonal: vehicle.isPersonal,

	        interestRate: loan.rate,
	        loanFinanceCharge: loan.financeCharge.toFixed(2),
	        loanAmountFinanced: loan.financed.toFixed(2),
			loanTotal: (loan.financed + loan.financeCharge).toFixed(2),
	        downpayment: loan.down,
	        totalSalePrice: (loan.financed + loan.financeCharge + loan.down).toFixed(2),

	        numberOfPayments: loan.term,
	        paymentAmount: loan.payment.toFixed(2),
            contractDate: randDate(),

			insuranceDeductable: insurance.deductable,
	        insuranceCollision: insurance.collision,
	        insuranceInjury: insurance.injury,
	        insuranceDamage: insurance.damage,
	        insurancePremium: insurance.premium,
	        insuranceSeller: insurance.seller,

	        coBuyerSignature: coBuyer.fullName,

	        ssn: ssn,

	        dlNumber: driversLicense.id,
	        dlClass: driversLicense.class,
	        dlIssuedOn: driversLicense.issuedOn,
	        dlExpiresOn: driversLicense.expireOn,
	        dlBirth: driversLicense.birth,
	        address: driversLicense.address,
	        dlRestrict: driversLicense.restriction,
	        dlHeight: driversLicense.height,
	        dlSex: driversLicense.sex,
	        dlEyes: driversLicense.eyes,
	        dlDd: driversLicense.dd,

	        naic: insurance.naic,
	        policyNumber: insurance.policyNumber,
	        insuranceEffective: insurance.effectiveDate,
	        insuranceExpiration: insurance.expiration,

	        handwriting: {
                angle: randomInt(-4, 4) * .025,
                font: 'future todo',
                size: randomInt(3, 12) * .1,
                color: {r: randomInt(0,255), g: randomInt(0,255), b: randomInt(0,255)}
            }
        }
    }
};