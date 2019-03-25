/* MTI CONFIDENTIAL INFORMATION */

var express = require('express');
var router = express.Router();

var menus = require('../config/menus');
var libInventoryLogging = require('../libs/libInventoryLogging');
// Mod by Roy for move the function control code to utility.js, 2018-03-07.
// var libInvResult = require('../libs/libInvResults');
var libUtility = require('../libs/libUtility');
var response = function () {};

router.get('/inventorylogging', function(req, res) {
	var DBNum = 1, DBCount = 0;
	var inventorylogging;

	libInventoryLogging.getDBinventorylogging(function (result) {
		inventorylogging = result;
		DBCount++;
	});

	response = function () {
		if (DBCount < DBNum) {
			console.log("Get Processing...");
			setTimeout(response, 100);
		} else {
			DBCount = 0;
			res.render('./inventorylogging/inventorylogging.html', {
		        target: 'inventorylogging',
		        menus: menus,
		        inventorylogging: inventorylogging,
		    });
		}
	}
	response();
});

router.post('/inventorylogging', function(req, res) {
	var loggingSetData = JSON.parse(req.body.loggingSet);;
	var DBNum = 1, DBCount = 0;
	var error = "";
	var currentTime = new Date().toISOString().split('.')[0];
	//var configFuntionID = 14, configSet = false;
	var configRun = {
		state:false,
		RUN:1,
		StartTime:currentTime,
		errRetry:0,
		configOnce:false
	};
	// var setConfigFunction = function (data) {
	// 	libInvResult.setDBfunctions(data, configFuntionID, function (err) {
	// 		if (err != "") {
	// 			if (data.errRetry < 5) {
	// 				console.log("Try to set Config Function for next 100ms..."+data.errRetry);
	// 				data.errRetry++;
	// 				setTimeout(function (){setConfigFunction(data)},200);
	// 			} else {
	// 				error += err + "\r\n";
	// 				configSet = true;
	// 			}
	// 		} else {
	// 			configSet = true;
	// 		}
	// 	});
	// };
	var setInventorylogging = function (data) {
		libInventoryLogging.setDBinventorylogging(data, function(err){
			if (err != "") {
				if (data.errRetry < 5) {
					console.log("Try to set Inventory logging for next 100ms..."+data.errRetry);
					data.errRetry++;
					setTimeout(function (){setInventorylogging(data)},200);
				} else {
					DBCount++;
					error += err + "\r\n";
				}
            } else {
            	DBCount++;
            }
		});
	}
	loggingSetData.errRetry = 0;
	setInventorylogging(loggingSetData);

	var response = function () {
		if (DBCount < DBNum) {
			console.log("Set Processing...");
			setTimeout(response, 100);
		} else {
			//if (configSet) {
			if (configRun.state) {
				DBCount = 0;
				if (error == "") {
					res.json({
						error: "Set Logging Data Successful!",
					});
				} else {
					res.json({
						error: error,
					});
				}
			} else {
				console.log("Set Config Processing...");
				//setConfigFunction(configRun);
				if (!configRun.configOnce) {
					libUtility.setConfiguration(configRun, function (err) {
						error += err + "\r\n";
						configRun.state = true;
					});
					configRun.configOnce = true;
				}
// End by Roy for move the function control code to utility.js, 2018-03-07.
				setTimeout(response, 100);
			}
		}
	}
	response();
});

module.exports = router;
