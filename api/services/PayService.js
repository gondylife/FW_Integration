var q = require('q');
var Flutterwave = require("flutterwave");
var flutterwave = new Flutterwave("tk_qWfXkx6ytHRn7u2BihmV", "tk_crHjS2nzEs");

module.exports = {
	tokenizeCard: function(req) {
		var deferred = q.defer();
		var data = {
			"validateoption": "" + req.body.validateoption,
        	"authmodel": "" + req.body.authmodel,
        	"cardno": "" + req.body.cardno,
        	"cvv": "" + req.body.cvv,
        	"expirymonth": "" + req.body.expirymonth,
        	"expiryyear": "" + req.body.expiryyear
		}
		if (req.body.authmodel === "PIN") {
			data.pin = "" + req.body.pin;
		} else if (req.body.authmodel === "BVN") {
			data.bvn = "" + req.body.bvn;
		} else if (req.body.authmodel === "VBVSECURECODE") {
			data.responseurl = "" + req.body.responseurl;
		}
		flutterwave.Card.tokenize(
			data, function(err, response, body) {
				if (body && body.status === 'success') {
		    		deferred.resolve(body.data);
			    } else {
			      	sails.log.warn('Failed tokenizing card: ', body);
			      	deferred.reject(body.data);
			    }
			}
		);
		return deferred.promise;
	},
	chargeCard: function(req) {
		var deferred = q.defer();
		var data = {
			"amount": "" + req.body.amount,
        	"authmodel": "" + req.body.authmodel,
        	"cardno": "" + req.body.cardno,
        	"currency": "" + req.body.currency,
            "custid": "" + req.body.custid,
        	"cvv": "" + req.body.cvv,
        	"expirymonth": "" + req.body.expirymonth,
        	"expiryyear": "" + req.body.expiryyear,
        	"narration": "" + req.body.narration
		}
		if (req.body.authmodel === "PIN") {
			data.pin = "" + req.body.pin;
		} else if (req.body.authmodel === "BVN") {
			data.bvn = "" + req.body.bvn;
		} else if (req.body.authmodel === "VBVSECURECODE") {
			data.responseurl = "" + req.body.responseurl;
		}
		flutterwave.Card.charge(
			data,
			function(err, response, body) {
				if (body && body.status === 'success') {
		    		deferred.resolve(body.data);
			    } else {
			      	sails.log.warn('Failed charging card: ', body);
			      	deferred.reject(body.data);
			    }
			}
		);
		return deferred.promise;
	},
	validateCard: function(req) {
		var deferred = q.defer();
		var data = {
            "otptransactionidentifier": "" + req.session.otptransactionidentifier, 
            "otp": "" + req.body.otp
		}
		flutterwave.Card.validate(
			data, function(err, response, body) {
				if (body && body.status === 'success') {
		    		deferred.resolve(body);
			    } else {
			      	sails.log.warn('Failed validating card charge: ', body);
			      	deferred.reject(body.data);
			    }
			}
		);
		return deferred.promise;
	},
	initiateAccount: function(req) {
		var deferred = q.defer();
		flutterwave.Account.initiateRecurrentPayment(req.body.accountno, function(err, response, body) {
			if (body && body.status === 'success') {
		    	deferred.resolve(body.data);
		    } else {
		      	sails.log.warn('Failed initiating account: ', body);
		      	deferred.reject(body.data);
		    }
		});
		return deferred.promise;
	},
	validateAccount: function(req) {
		var deferred = q.defer();
		flutterwave.Account.validateRecurrentAccount({ 
		  	"otp": "" + req.body.otp,
		  	"accountNumber": "" + req.session.accountno,
		  	"reference": "" + req.session.reference,
		  	"billingamount": "" + req.session.billingamount,
		  	"debitnarration": "" + req.session.debitnarration
		}, function(err, response, body) {
		    if (body && body.status === 'success') {
		    	deferred.resolve(body.data);
		    } else {
		      	sails.log.warn('Failed validating payment: ', body);
		      	deferred.reject(body.data);
		    }
		});
		return deferred.promise;
	},
	chargeAccount: function(req) {
		var deferred = q.defer();
		flutterwave.Account.chargeRecurrentAccount({
  			"accountToken": "" + req.session.accountToken,
		  	"billingamount": "" + req.session.billingamount,
		  	"debitnarration": "" + req.session.debitnarration
		}, function(err, response, body) {
		    if (body && body.status === 'success') {
		    	deferred.resolve(body);
		    } else {
		      	sails.log.warn('Failed charging account: ', body);
		      	deferred.reject(body.data);
		    }
		});
		return deferred.promise;
	},
	disburseFunds: function(req) {
		var deferred = q.defer();
		flutterwave.Disburse.send({
  			"transferamount": "" + req.body.amount,
		    "uniquereference": "" + req.body.reference,
		    "recipientaccount": "" + req.body.account,
		    "narration": "" + req.body.narration,
		    "recipientname": "" + req.body.recipient,
		    "sendername": "" + req.body.sendername,
		    "country": "" + req.body.country,
		    "destbankcode": "" + req.body.bank,
		    "currency": "" + req.body.currency
		}, function(err, response, body) {
		    if (body && body.status === 'success') {
		    	deferred.resolve(body);
		    } else {
		      	sails.log.warn('Failed sending money: ', body);
		      	deferred.reject(body.data);
		    }
		});
		return deferred.promise;
	}
};