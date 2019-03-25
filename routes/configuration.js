/* MTI CONFIDENTIAL INFORMATION */

var express = require('express');
var router = express.Router();

var menus = require('../config/menus');
var libConfiguration = require('../libs/libConfiguration');
// Mod by Roy for move the function control code to utility.js, 2018-03-07.
// var libInvResult = require('../libs/libInvResults');
var libUtility = require('../libs/libUtility');
var multer = require('multer');
var storage = multer.diskStorage({
	destination:'public/upload',
	filename:function (req, file, cb) {
		 cb(null, file.originalname);
	 },
});
var upload = multer({storage: storage});

router.get('/configuration', function(req, res) {
	var DBNum = 1, DBCount = 0;
	var configuration;

	libConfiguration.getDBconfiguration(function (result) {
		configuration = result;
		DBCount++;
	});

	response = function () {
		if (DBCount < DBNum) {
			console.log("Get Processing...");
			setTimeout(response, 100);
		} else {
			DBCount = 0;
			res.render('./configuration/configuration.html', {
				target: 'configuration',
				menus: menus,
				configuration: configuration,
			});
		}
	}
	response();
});

router.post('/configuration', function(req, res) {
	var params = req.body;
	var configSetData = JSON.parse(params.postData);
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
	var setConfiguration = function(data){
		libConfiguration.setDBconfiguration(data, function(err){
			if (err != "") {
				if (data.errRetry < 5) {
					console.log("Try to set configuration for next 100ms..."+data.errRetry);
					data.errRetry++;
					setTimeout(function (){setConfiguration(data)},200);
				} else {
					DBCount++;
					error += err + "\r\n";
				}
			} else {
				DBCount++;
			}
		});
	}
	configSetData.configuration.errRetry=0;
	setConfiguration(configSetData.configuration);

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
						error: "Set Config Data Successful!",
					});
				} else {
					res.json({
						error: error,
					});
				}
			} else {
				//setConfigFunction(configRun);
				console.log("Set Config Processing...");
				if (!configRun.configOnce) {
					libUtility.setConfiguration(configRun, function (err) {
						error += err + "\r\n";
						configRun.state = true;
					});
					configRun.configOnce = true;
				}
// End by Roy for replace function control to utility, 2018-03-07.
				setTimeout(response, 100);
			}
		}
	}
	response();
})

router.post('/configurationAuth',upload.array('Auth',3), function(req, res){
	console.log("upload Successful!");
});

module.exports = router;
