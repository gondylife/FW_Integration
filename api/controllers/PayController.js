/**
 * AppController
 *
 * @description :: Server-side logic for managing Pays
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	tokenizeCard: function(req, res) {
		PayService.tokenizeCard(req)
		.then(function(response) {
			console.log(response.responsetoken);
		})
	},
	payCard: function(req, res) {
		PayService.chargeCard(req)
		.then(function(response) {
			req.session.otptransactionidentifier = response.transactionreference;
			return res.view('pay/validateCard');
		})
	},
	validateCard: function(req, res) {
		PayService.validateCard(req)
		.then(function(response) {
			delete req.session.otptransactionidentifier
			if (response.status === 'success') {
		    	return res.view('pay/success');
			} else {
		    	return res.view('pay/failure');
			}
		})
	},
	payAccount: function(req, res) {
		PayService.initiateAccount(req)
		.then(function(response) {
			req.session.accountno = req.body.accountno;
			req.session.billingamount = req.body.billingamount;
	    	req.session.reference = response.transactionReference;
	    	req.session.debitnarration = req.body.debitnarration;
	    	return res.view('pay/validateAccount');
		})
	},
	validateAccount: function(req, res) {
		PayService.validateAccount(req)
		.then(function(response) {
			req.session.accountToken = response.accountToken;
			return PayService.chargeAccount(req);
		})
		.then(function(response) {
			delete req.session.accountno;
			delete req.session.accountToken;
	    	delete req.session.billingamount;
		    delete req.session.reference;
		    delete req.session.debitnarration;
			if (response.status === 'success') {
		    	return res.view('pay/success');
			} else {
		    	return res.view('pay/failure');
			}
		})
	},
	disburseFunds: function(req, res) {
		PayService.disburseFunds(req)
		.then(function(response) {
			if (response.status === 'success') {
		    	return res.view('pay/success');
			} else {
		    	return res.view('pay/failure');
			}
		})
	}
};