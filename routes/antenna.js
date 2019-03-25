/* MTI CONFIDENTIAL INFORMATION */

var express = require('express');
var router = express.Router();
var async = require('async'); // Mod by Roy for change architecture of router via async module, 2018-08-07.

var menus = require('../config/menus');
var libAntenna = require('../libs/libAntenna');
// Mod by Roy for move the function control code to utility.js, 2018-03-07.
// var libInvResult = require('../libs/libInvResults');
var libUtility = require('../libs/libUtility');

router.get('/antenna', function(req, res) {
	var DBNum = 3, DBCount = 0;
	var profileID;
	var singulation;
	var antenna;
  //Mod by Roy for change architecture of router via async module, 2018-08-07.
	async.parallel([
		function (finish) {
			libAntenna.getDBprofileID(function (result) {
				profileID = result;
				finish();
			});
		},
		function (finish) {
			libAntenna.getDBsingulation(function (result) {
				singulation = result;
				finish();
			});
		},
		function (finish) {
			libAntenna.getDBantenna(function (result) {
				antenna = result;
				finish();
			});
		}
	], function () {
		res.render('./antenna/antenna.html', {
			target: 'antenna',
			menus: menus,
			profileID: profileID,
			singulation: singulation,
			antenna: antenna,
		});
	});
  
	// libAntenna.getDBprofileID(function (result) {
	// 	profileID = result;
	// 	DBCount++;
	// });
	//
	// libAntenna.getDBsingulation(function (result) {
	// 	singulation = result;
	// 	DBCount++;
	// });
	//
	// libAntenna.getDBantenna(function (result) {
	// 	antenna = result;
	// 	DBCount++;
	// });
	//
	// var response = function () {
	// 	if (DBCount < DBNum) {
	// 		console.log("Get Processing...");
	// 		setTimeout(response, 100);
	// 	} else {
	// 		DBCount = 0;
	// 		res.render('./antenna/antenna.html', {
	// 	        target: 'antenna',
	// 	        menus: menus,
	// 			profileID: profileID,
	// 			singulation: singulation,
	// 			antenna: antenna,
	// 	    });
	// 	}
	// }
	// response();
  // End by Roy for change architecture of router via async module, 2018-08-07.
});
router.post('/antenna', function(req, res) {
    var params = req.body;
	var setData = JSON.parse(params.postData);
	var DBNum = setData.antenna.length + setData.singulation.length;
	var DBCount = 0;
	var error = "";
	var currentTime = new Date().toISOString().split('.')[0];
	// var configFuntionID = 14, configSet = false;
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
	var setAnt = function (data) {
		libAntenna.setDBantenna(data, function(err){
            if (err != "") {
				if (data.errRetry < 5) {
					console.log("Try to set antenna for next 100ms..."+data.errRetry);
					data.errRetry++;
					setTimeout(function (){setAnt(data)},200);
				} else {
					DBCount++;
					error += err + "\r\n";
				}
            } else {
            	DBCount++;
            }
		});
	};
	var setSingulation = function(data){
		libAntenna.setDBsingulation(data, function(err){
			if (err != "") {
				if (data.errRetry < 5) {
					console.log("Try to Set Singulation for next 100ms..."+data.errRetry);
					data.errRetry++;
					setTimeout(function (){setSingulation(data)},200);
				} else {
					DBCount++;
					error += err + "\r\n";
				}
			} else {
				DBCount++;
			}
		});
	};

	for (var i = 0; i < setData.antenna.length; i++) {
		setData.antenna[i].errRetry = 0;
		setAnt(setData.antenna[i]);
	}
	setData.singulation[0].errRetry = 0;
	setSingulation(setData.singulation[0]);

	var response = function () {
		if (DBCount < DBNum) {
			console.log("Set Processing...");
			setTimeout(response, 100);
		} else {
			// if (configSet) {
			if (configRun.state) {
				DBCount = 0;
				if (error == "") {
					res.json({
						error: "Set antenna Successful!",
					});
				} else {
					res.json({
						error: error
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
})

module.exports = router;
