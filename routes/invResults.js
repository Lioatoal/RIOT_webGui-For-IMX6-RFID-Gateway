/* MTI CONFIDENTIAL INFORMATION */

var express = require('express');
var async = require('async'); //Add by Roy for add beep function, 2018-12-25.
var router = express.Router();

var menus = require('../config/menus');
// Mod by Roy for move the function control code to utility.js, 2018-03-07.
//var lib = require('../libs/libInvResults');
var libInvResult = require('../libs/libInvResults');
var libUtility = require('../libs/libUtility');
var libInventoryLogging = require('../libs/libInventoryLogging');

var response = function () {};

// Mod by Roy for change interval of inventory by output thread sleep timer, 2018-03-07.
// router.get('/invResults', function(req, res) {
// 	//Mod by Roy for not query inventory data when direct to inventory scan page, 2018-02-22.
// 	// var DBNum = 3, DBCount = 0;
// 	var DBNum = 2, DBCount = 0;
// 	var invResults = [];
// 	var gpsTimer, gpsResults;
//
// 	// var getTime = new Date().toISOString().split('.');
// 	// var currentTime = getTime[0];
// 	// lib.getDBinvResults(currentTime, function (result) {
// 	// 	invResults = result;
// 	// 	DBCount++;
// 	// });
// 	//End by Roy for not query inventory data when direct to inventory scan page, 2018-02-22.
// 	lib.getGPSTimer(function (result) {
// 		gpsTimer = result;
// 		DBCount++;
// 	});
// 	//Mod by Roy for get lastest GPS data, 2018-02-22.
// 	// lib.getGPSResults(currentTime, function (result) {
// 	lib.getGPSResults(function (result) {
// 	//End by Roy for get lastest GPS data, 2018-02-22.
// 		gpsResults = result;
// 		DBCount++;
// 	});
//
// 	response = function () {
// 		if (DBCount < DBNum) {
// 			console.log("Get Processing...");
// 			setTimeout(response, 100);
// 		} else {
// 			DBCount = 0;
// 			res.render('./invResults/invResults.html', {
// 		        target: 'invResults',
// 		        menus: menus,
// 				invResults: invResults,
// 				gpsTimer: gpsTimer,
// 				gpsResults : gpsResults
// 		    });
// 		}
// 	}
// 	response();
// });
router.get('/invResults', function(req, res) {
  //Del by Roy for remove the data getting method that geting from RFID/GPS consolidate table, 2018-09-14.
	// var DBNum = 2, DBCount = 0;
	// var invResults = [];
	//Mod by Roy for show error log if get method return error, 2018-03-28.
	//var gpsTimer, gpsResults;
	//var invTimer;
	// var gpsTimer = [], gpsResults = [];
	// var invTimer = [];

	// libInventoryLogging.getDBinventorylogging(function (result) {
	// 	if (result.length != 0) {
	// 		invTimer.push(result[0].TIMER_Output);
	// 	}
		//invTimer = result[0].TIMER_Output;
	// 	DBCount++;
	// });
	// libInvResult.getGPSTimer(function (result) {
	// 	if (result.length != 0) {
	// 		gpsTimer.push(result[0].TIMER_GPS);
	// 	}
		//gpsTimer = result;
	// 	DBCount++;
	// });
	// libInvResult.getGPSResults(function (result) {
	// 	if (result.length != 0) {
	// 		gpsResults.push(result[0]);
	// 	}
	// 	//gpsResults = result;
	// 	DBCount++;
	// });
	//End by Roy for show error log if get method return error, 2018-03-28.

	// response = function () {
	// 	if (DBCount < DBNum) {
	// 		console.log("Get Processing...");
	// 		setTimeout(response, 100);
	// 	} else {
	// 		DBCount = 0;
	// 		res.render('./invResults/invResults.html', {
	// 	        target: 'invResults',
	// 	        menus: menus,
	// 			invTimer: invTimer,
	// 			gpsTimer: gpsTimer,
	// 			gpsResults : gpsResults
	// 	    });
	// 	}
	// }
	// response();
    //Add by Roy for add beep function, 2018-12-25.
    let beepConf = 0;
    async.series([
        (next)=>{
            libInvResult.getBeepConf((result)=>{
                if (result.length != 0) {
                    beepConf = result[0].Beep;
                }
                next();
            });
        }
    ],(errs, results)=>{
        res.render('./invResults/invResults.html', {
        target: 'invResults',
        menus: menus,
        beepConf: beepConf
    	});
    //End by Roy for add beep function, 2018-12-25.
    });
  //End by Roy for remove the data getting method that geting from RFID/GPS consolidate table, 2018-09-14.
});
// End by Roy for change interval of inventory by output thread sleep timer, 2018-03-07.
// router.post('/invResults', function(req, res) {
//     var params = req.body;
// 	var currentTime = new Date().toISOString().split('.')[0];
// 	var configFuntionID = 1;
// 	var invRun = {
// 		RUN:params.run,
// 		StartTime:currentTime,
// 		errRetry:0
// 	};
// 	var accessInvResults = function (data) {
// 		if (data.RUN < 0) {
// 			//delete DB invResults
// 			lib.deleteDBinvResults(function(err){
// 				if (err != "") {
// 					if (data.errRetry < 5) {
// 						console.log("Try to Set delete DB invResults for next 100ms..."+data.errRetry);
// 						data.errRetry++;
// 						setTimeout(function (){accessInvResults(data)},200);
// 					} else {
// 						res.json({
// 							error:err,
// 						});
// 					}
// 				} else {
// 					res.json({
// 						error:"Delete successful!!",
// 					});
// 				}
// 			});
// 		} else if( data.RUN >= 0){
// 			//set DB functions
// 			lib.setDBfunctions(data, configFuntionID, function (err) {
// 				if (err != "") {
// 					if (data.errRetry < 5) {
// 						console.log("Try to Set DB functions for next 100ms..."+data.errRetry);
// 						data.errRetry++;
// 						setTimeout(function (){accessInvResults(data)},200);
// 					} else {
// 						res.json({
// 							error:err,
// 						});
// 					}
// 				} else {
// 					res.json({
// 						error:"",
// 					});
// 				}
// 	        });
// 		}
// 	}
// 	accessInvResults(invRun);
// });
router.post('/invResults', function(req, res) {
    var params = req.body;
	var currentTime = new Date().toISOString().split('.')[0];
	var configFuntionID, clearMax = 5, clearRetry = 1;
	var invRun = {
		RUN:params.run,
		StartTime:currentTime,
		errRetry:0
	};
	var setInvFunctions = function (data, functionID, callback) {
		// libInvResult.setDBfunctions(data, configFuntionID, function (err) {
		libUtility.setDBfunctions(data, configFuntionID, function (err) {
			//Mod by Roy for improve code performance by async/retransmission mechanism, 2018-04-13.
			// if (err != "") {
			// 	if (data.errRetry < 5) {
			// 		console.log("Try to Set DB functions for next 100ms..."+data.errRetry);
			// 		data.errRetry++;
			// 		setTimeout(function (){setInvFunctions(data, configFuntionID, callback)},200);
			// 	} else {
			// 		callback(err)
			// 	}
			// } else {
			// 	callback("");
			// }
			callback(err);
			//End by Roy for improve code performance by async/retransmission mechanism, 2018-04-13.
		});
	}
	var accessInvResults = function (data) {
		if (data.RUN < 0) {
			//stop inventory before clear
			data.RUN = 0;
			configFuntionID = 1;
			setInvFunctions(data, configFuntionID, function (err) {
				if (err != "") {
					res.json({error:err});
				} else {
					console.log("stop ready");
					data.RUN = 1;
					configFuntionID = 15;
					setInvFunctions(data, configFuntionID, function (err) {
						res.json({error:err});
					});
				}
			});
		} else if( data.RUN >= 0){
			configFuntionID = 1;
			setInvFunctions(data, configFuntionID, function (err) {
				res.json({error:err});
// End by Roy for move the function control code to utility.js, 2018-03-07.
			});
		}
	}
	accessInvResults(invRun);
});

module.exports = router;
