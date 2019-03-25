/* MTI CONFIDENTIAL INFORMATION */

var express = require('express');
var router = express.Router();
var async = require('async');
var url = require('url');

var menus = require('../config/menus');
var libRFTest = require('../libs/libRFTest');
var libUtility = require('../libs/libUtility');

router.get('/RFTest', function(req, res) {
	var invData =[], GPSData=[], regionData=[], freqData=[], fastTID=[];
	var band = 0;

	async.parallel([
		function (finish) {
    //Add by Roy for remove the data getting method that geting from RFID/GPS consolidate table, 2018-09-14.
		// 	libRFTest.getRFTestInv(function (result) {
		// 		invData = result;
		// 		finish();
		// 	});
		// },
		// function (finish) {
		// 	libRFTest.getRFTestGPS(function (result) {
		// 		GPSData = result;
		// 		finish();
		// 	});
		// },
    //End by Roy for remove the data getting method that geting from RFID/GPS consolidate table, 2018-09-14.
			libRFTest.getRegion(function (result) {
				regionData = result;
				finish();
			});
		},
		function (finish) {
			libRFTest.getFreq(band, function (result) {
				freqData = result;
				finish();
			});
		},
		function (finish) {
			libRFTest.getFastTID(function (result) {
				fastTID = result;
				finish();
			});
		}

	], function () {
		res.render('./RFTest/RFTest.html', {
			target: 'RFTest',
			menus: menus,
			invData: invData,
			GPSData: GPSData,
			regionData: regionData,
			freqData: freqData,
			fastTID: fastTID
		});
	});
});

router.get('/RFTest/Region2Freq', function(req, res) {
	var params = url.parse(req.url, true);
	var band = params.query.band;
	var freqData;
	async.parallel([
		function (finish) {
			libRFTest.getFreq(band, function (result) {
				freqData = result;
				finish();
			});
		},
	], function () {
		res.json({freqData: freqData});
	});
});

router.post('/RFTest/PING', function (req, res) {
	var params = req.body;
	var PINGData = JSON.parse(params.postData);
	var PINGResult = "";
	async.parallel([
		function (finish) {
			libRFTest.setPING(PINGData, function (err) {
				if (err != "") {
					res.json({error: err});
					return;
				} else {
					finish();
				}
			});
		},
	], function () {
		res.json({error: "PING is configured successfully!"});
	});
})

router.post('/RFTest', function(req, res) {
	var params = req.body;
	var RFTestData = JSON.parse(params.postData);
	var RFTestResult = "";
	var RFTestFunctionsID = 13;
	var RFTestRun = {RUN:1};

	async.parallel([
		function (finish) {
			libRFTest.setRFTest(RFTestData, function (err) {
				if (err != "") {
					res.json({error: err});
					return;
				} else {
					finish();
				}
			});
		},
		function (finish) {
			libUtility.setDBfunctions(RFTestRun, RFTestFunctionsID, function (err) {
				if (err != "") {
					res.json({error: err});
					return;
				} else {
					finish();
				}
			});
		},
	], function () {
		res.json({error: 'RFTEST is configured successfully!'});
	});
});

module.exports = router;
