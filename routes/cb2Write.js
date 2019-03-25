/* MTI CONFIDENTIAL INFORMATION */

var express = require('express');
var router = express.Router();

var menus = require('../config/menus');
var libCB2Write = require('../libs/libCB2Write');
var libInvResult = require('../libs/libInvResults');
// Mod by Roy for move the function control code to utility.js, 2018-03-07.
var libUtility = require('../libs/libUtility');
var url = require('url');
var async = require('async'); // Add by Roy for improve code performance by async/retransmission mechanism, 2018-04-13.
var keepCB2Data = [];

router.get('/cb2Write', function(req, res) {
	var sid = req.cookies['connect.sid'];
	// var DBNum = 0, DBCount = 0;
	if (keepCB2Data[sid] == null) {
		keepCB2Data[sid] = "";
	}
	// response = function () {
	// 	if (DBCount < DBNum) {
	// 		console.log("Get Processing...");
	// 		setTimeout(response, 200);
	// 	} else {
	// 		DBCount = 0;
	// 		res.render('./CB2Write/CB2Write.html', {
	// 			target: 'CB2Write',
	// 			menus: menus,
	// 			rowData : keepCB2Data[sid]
	// 		});
	// 	}
	// }
	// response();
	res.render('./CB2Write/CB2Write.html', {
		target: 'CB2Write',
		menus: menus,
		rowData : keepCB2Data[sid]
	});
});
// Mod by Roy for improve code performance by async/retransmission mechanism, 2018-04-13.
// router.get('/cb2Write/cb2TagEPC', function(req, res) {
// 	var sid = req.cookies['connect.sid'];
// 	//Mod by Roy for change the date format, 2018-02-22.
// 	// var currentTime = new Date().toISOString().split('.')[0];
// 	var startTime = new Date().getTime();
// 	var runTime = parseInt(url.parse(req.url, true).query.runTime);
// 	var invRun = {
// 		RUN:1,
// 		StartTime: startTime,
// 		RunTime: startTime+(runTime*1000),
// 		errRetry:0,
// 	};
// 	//End by Roy for change the date format, 2018-02-22.
// 	var functionRetryMax = 2;
// 	var invFuntionID = 1;
// 	var webRoleData = [], cb2TagData = {}, error="";
// 	var DBNum = 1, DBCount = 0;
// 	var getInvResults = function () {
// 		//Mod by Roy for get a interval inventory result, 2018-02-22.
// 		var interval = {
// 			start: invRun.StartTime,
// 			end: invRun.RunTime
// 		}
// 		libInvResult.getDBinvResults(interval, function (result) {
// 		//End by Roy for get a interval inventory result, 2018-02-22.
// 			cb2TagData = result;
// 			DBCount++;
// 		});
// 	};
// 	var getInvRun = function (retry) {
// 		libUtility.getDBfunctions(invFuntionID, function (result) {
// 			if(result.run) {
// 				if (result.run == 0) {
// 					getInvResults();
// 				} else {
// 					// Mod by Roy for change the run time format, 2018-02-22.
// 					// functionRetryMax += parseInt(invRun.RunTime);
// 					// if (retry < functionRetryMax) {
// 					if (retry < runTime) {
// 					// End by Roy for change the run time format, 2018-02-22.
// 						setTimeout(function (){getInvRun(retry)},1000);
// 						retry++;
// 					} else {
// 						cb2TagData.error = "Inventory Error!";
// 						DBCount++;
// 					}
// 				}
// 			} else if(result.error){
// 				cb2TagData = result;
// 				DBCount++;
// 			}
// 		});
// 	};
// 	var setInvRun = function (data) {
// 		libUtility.setDBfunctions(data, invFuntionID, function (err) {
// 			if (err != "") {
// 				if (data.errRetry < 5) {
// 					console.log("Try to Set Inventory function for next 100ms..."+data.errRetry);
// 					data.errRetry++;
// 					setTimeout(function (){setInvRun(data)},200);
// 				} else {
// 					cb2TagData.error = err;
// 					DBCount++;
// 				}
// 			} else {
// 				var retry = 0;
// 				getInvRun(retry);
// 			}
// 		});
// 	};
// 	setInvRun(invRun);
//
// 	var response = function () {
// 		if (DBCount < DBNum) {
// 			console.log("Get Processing...");
// 			setTimeout(response, 100);
// 		} else {
// 			DBCount = 0;
// 			if (cb2TagData.error) {
// 				res.json({error : cb2TagData.error});
// 			} else {
// 				for(var i in cb2TagData){
// 					webRoleData.push({epc: cb2TagData[i].EPC});
// 				}
// 				keepCB2Data[sid] = webRoleData;
// 				res.json(webRoleData);
// 			}
// 		}
// 	};
// 	response();
// });
router.get('/cb2Write/cb2TagEPC', function(req, res) {
	var sid = req.cookies['connect.sid'];

	var startTime = new Date().getTime();
	var runTime = parseInt(url.parse(req.url, true).query.runTime);
	var invRun = {
		RUN:1,
		StartTime: startTime,
		RunTime: runTime
	};
	var invFuntionID = 1;
	var webRoleData = [], cb2TagData = {};

	async.waterfall([
	    function(next){
			libUtility.setDBfunctions(invRun, invFuntionID, function (err) {
				if (err != "") {
					cb2TagData.error = err;
					res.json({error : cb2TagData.error});
					return;
				} else {
					var retry = 0;
					next(null, retry);
				}
			});
	    },
	    function (retry, next){
			libUtility.getDBfunctions(invFuntionID, callback = function (result) {
				//Mod by Roy for fix inventory run flag checking bug, 2018-04-23.
				if(result.error){
					cb2TagData = result;
					res.json({error : cb2TagData.error});
					return;
				}
				if (result.run == 0) {
					next();
				} else {
          //Mod by Tom for remove 3 seconds delay, 2018-08-29.
          if (retry < runTime) { 
					//if (retry < runTime + 3) { //Add by Tom for engine need 3 seconds to ready for inventory, 2018-08-07.
          //End by Tom for remove 3 seconds delay, 2018-08-29.
						setTimeout(function (){libUtility.getDBfunctions(invFuntionID, callback)},1000);
						retry++;
					} else {
						cb2TagData.error = "RFID reader is in inventory!";
						res.json({error : cb2TagData.error});
						return;
					}
				}

				// if(result.run) {
				// 	if (result.run == 0) {
				// 		next();
				// 	} else {
				// 		if (retry < runTime) {
				// 			setTimeout(function (){libUtility.getDBfunctions(invFuntionID, callback)},1000);
				// 			retry++;
				// 		} else {
				// 			cb2TagData.error = "RFID reader is in inventory!";
				// 			res.json({error : cb2TagData.error});
				// 			return;
				// 		}
				// 	}
				// } else if(result.error){
				// 	cb2TagData = result;
				// 	res.json({error : cb2TagData.error});
				// 	return;
				// }

			});
	    },
      //Del by Roy for remove the data getting method that geting from RFID/GPS consolidate table, 2018-09-14.
	    /*function(next){
			var interval = {
				start: invRun.StartTime,
			}
			libInvResult.getDBinvResults(interval, function (result) {
				if (result.length) {
					cb2TagData = result;
				}
				next();
			});
	    }*/
      //End by Roy for remove the data getting method that geting from RFID/GPS consolidate table, 2018-09-14.
	], function(){
    // Mod by Roy for consolidate duplicate tags, 2018-08-.
		var repeat = false;

		for(var i in cb2TagData){
			for(var j in webRoleData){
				if(webRoleData[j].epc == cb2TagData[i].EPC){
					repeat = true;
					break;
				}
			}
			if (!repeat) {
				webRoleData.push({epc: cb2TagData[i].EPC});
			}
    // End by Roy for consolidate duplicate tags, 2018-08-.
		}
		keepCB2Data[sid] = webRoleData;
		res.json(webRoleData);
	});
});

// router.post('/cb2write', function(req, res) {
// 	var cb2writeSetData = JSON.parse(req.body.postData);
// 	var DBNum = cb2writeSetData.length, DBCount = 0;
// 	var error = "";
// 	var CB2WriteFunctionsID = 9;
// 	var CB2WriteRun = {RUN:1, errRetry:0};
// 	var setCB2WriteRun = function (data) {
// 		// libInvResult.setDBfunctions(data, CB2WriteFunctionsID, function(err){
// 		libUtility.setDBfunctions(data, CB2WriteFunctionsID, function (err) {
// 			// if (err != "") {
// 			// 	if (data.errRetry < 5) {
// 			// 		console.log("Try to set CB2Write Run for next 100ms..."+data.errRetry);
// 			// 		data.errRetry++;
// 			// 		setTimeout(function (){setCB2writeRun(data)},200);
// 			// 	} else {
// 			// 		DBCount++;
// 			// 		error += err + "\r\n";
// 			// 	}
// 			// } else {
// 			// 	DBCount++;
// 			// }
// 			if (err != "") {
// 				error += err + "\r\n";
// 				DBCount++;
// 			} else {
// 				DBCount++;
// 			}
// 		});
// 	}
// 	var setCB2Control = function (data) {
// 		libCB2Write.setCB2Control(data, function(err){
// 			if (err != "") {
// 				if (data.errRetry < 5) {
// 					console.log("Try to set CB2 Control for next 100ms..."+data.errRetry);
// 					data.errRetry++;
// 					setTimeout(function (){setCB2Control(data)},200);
// 				} else {
// 					DBCount++;
// 					error += err + "\r\n";
// 				}
// 			} else {
// 				setCB2WriteRun(CB2WriteRun);
// 			}
// 		});
// 	}
//
// 	libCB2Write.getCB2ControlID(function (result) {
// 		if (result[0].CB2ControlID == null) {
// 			result[0].CB2ControlID = 0;
// 		}
// 		for (var i = 0; i < cb2writeSetData.length ; i++) {
// 			cb2writeSetData[i].errRetry = 0;
// 			cb2writeSetData[i].ID = result[0].CB2ControlID + i + 1;
// 			cb2writeSetData[i].SessionID = 1;
// 			setCB2Control(cb2writeSetData[i]);
// 		}
// 	});
//
// 	var response = function () {
// 		if (DBCount < DBNum) {
// 			console.log("Set Processing...");
// 			setTimeout(response, 100);
// 		} else {
// 			DBCount = 0;
// 			if (error == "") {
// 				res.json({
// 					error: "Set CB-2 Tag Successful!",
// 				});
// 			} else {
// 				res.json({
// 					error: error,
// 				});
// 			}
// 		}
// 	};
// 	response();
// });
router.post('/cb2write', function(req, res) {
	var cb2writeSetData = JSON.parse(req.body.postData);
	// var DBNum = cb2writeSetData.length, DBCount = 0;
	// var error = "";
	var CB2ControlID = 0;
	var CB2WriteFunctionsID = 9;
	var CB2WriteRun = {RUN:1, errRetry:0};
	var queue = [];

	queue.push(function (next) {
		libCB2Write.getCB2ControlID(function (result) {
			if (result.length && result[0].CB2ControlID != null) {
				CB2ControlID = result[0].CB2ControlID;
			}
			var id = 0;
			next('', id);
		});
	});

	for (var i = 0; i < cb2writeSetData.length ; i++) {
		queue.push(function (id, next) {
			cb2writeSetData[id].ID = CB2ControlID + id + 1;
			libCB2Write.setCB2Control(cb2writeSetData[id], function(err){
				if (err != "") {
					res.json({error: err});
					return;
				} else {
					id++;
					next('', id);
				}
			});
		});
	}

	async.waterfall(queue, function () {
		libUtility.setDBfunctions(CB2WriteRun, CB2WriteFunctionsID, function (err) {
			res.json({
				error: err,
			});
		});
	})
});
router.delete('/cb2write', function (req, res) {
	var sid = req.cookies['connect.sid'];
	delete keepCB2Data[sid];
	var DBNum = 0, DBCount = 0;
	var response = function () {
		if (DBCount < DBNum) {
			console.log("Get Processing...");
			setTimeout(response, 200);
		} else {
			DBCount = 0;
			res.json({
				error: "delete keepCB2Data!",
			});
		}
	};
	response();
})

router.get('/cb2Advance' , function (req, res) {
	//Mod by Roy for fix the EPC display abnormal bug in Advance tag page, 2018-03-28
	//var params = req.url.split("?");
	var params = url.parse(req.url, true);
	var epc = params.query.EPC;
	var DBNum = 0, DBCount = 0;
	var response = function () {
		if (DBCount < DBNum) {
			console.log("Get Processing...");
			setTimeout(response, 200);
		} else {
			DBCount = 0;
			res.render('./CB2Write/CB2WriteAdvance.html', {
				target: 'CB2WriteAdvance',
				menus: menus,
				//epc: params[1],
				epc:epc
	//End by Roy for fix the EPC display abnormal bug in Advance tag page, 2018-03-28
			});
		}
	};
	response();
});
// router.post('/cb2AdvanceRead' , function (req, res) {
// 	var params = JSON.parse(req.body.postData);
// 	params.errRetry = 0;
// 	var DBNum = 1, DBCount = 0;
// 	var result, error="";
// 	var readTagFuntionID = 2;
// 	var readTagRun = {RUN:1, errRetry:0};
// 	var getReadMethod = function () {
// 		libCB2Write.getReadTag(function (data) {
// 			if (data.error) {
// 				error += data.error + "\r\n";
// 				DBCount++;
// 			} else {
// 				// result = data.RESULT.toString();
// 				result = data;
// 				DBCount++;
// 			}
// 		});
// 	}
// 	var setReadFunction = function (data) {
// 		// libInvResult.setDBfunctions(data, readTagFuntionID, function (err) {
// 		libUtility.setDBfunctions(data, readTagFuntionID, function (err) {
// 			// if (err != "") {
// 			// 	if (data.errRetry < 5) {
// 			// 		console.log("Try to set Read Functions for next 100ms..."+data.errRetry);
// 			// 		data.errRetry++;
// 			// 		setTimeout(function (){setReadFunction(data, readTagFuntionID)},200);
// 			// 	} else {
// 			// 		DBCount++;
// 			// 		error += err + "\r\n";
// 			// 	}
// 			// } else {
// 			// 	setTimeout(getReadMethod, 1000);
// 			// }
// 			if (err != "") {
// 				error += err + "\r\n";
// 				DBCount++;
// 			} else {
// 				setTimeout(getReadMethod, 1000);
// 			}
// 		});
// 	}
// 	var setReadMethod = function (data) {
// 		libCB2Write.setReadTag(data, function(err){
// 			if (err != "") {
// 				if (data.errRetry < 5) {
// 					console.log("Try to set Read Method for next 100ms..."+data.errRetry);
// 					data.errRetry++;
// 					setTimeout(function (){setReadMethod(data)},200);
// 				} else {
// 					DBCount++;
// 					error += err + "\r\n";
// 				}
// 			} else {
// 				setReadFunction(readTagRun);
// 			}
// 		})
// 	}
// 	setReadMethod(params);
//
// 	var response = function () {
// 		if (DBCount < DBNum) {
// 			console.log("Get Processing...");
// 			setTimeout(response, 200);
// 		} else {
// 			DBCount = 0;
// 			if (error == "") {
// 				res.json({
// 					// tag: result,
// 					tag: result,
// 					error: "Read Tag Successful!",
// 				});
// 			} else {
// 				res.json({
// 					error: error,
// 				});
// 			}
// 		}
// 	}
// 	response();
// });
router.post('/cb2AdvanceRead' , function (req, res) {
	var params = JSON.parse(req.body.postData);
	var redTagData = params;
	var readTagFuntionID = 2;
	var readTagRun = {RUN:1, errRetry:0};

	async.waterfall([
	    function(next){
			libCB2Write.setReadTag(redTagData, function(err){
				if (err != "") {
					res.json({error: err});
				} else {
					next();
				}
			})
	    },
	    function (next){
			libUtility.setDBfunctions(readTagRun, readTagFuntionID, function (err) {
				if (err != "") {
					res.json({error: err});
				} else {
					setTimeout(function () {
						next();
					}, 1000);
				}
			});
	    }
	], function(){
		libCB2Write.getReadTag(function (result) {
			if (result.length) {
				res.json({
					//Mod by Roy for follow Tom's decision to modify HEX/ASCII translation, 2018-04-23.
					// tag: result[0],
					// error: "Read Tag Successful!",
					tagFormat: result[0].TagFormat,
					result: result[0].RESULT
				});
			} else {
				res.json({
					// error: error,
					error: "Get read tag result failed!",
					//End by Roy for follow Tom's decision to modify HEX/ASCII translation, 2018-04-23.
				});
			}
		});
	});
});
// router.post('/cb2AdvanceWrite' , function (req, res) {
// 	var params = JSON.parse(req.body.postData);
// 	params.errRetry = 0;
// 	var DBNum = 1, DBCount = 0;
// 	var result, error="";
// 	var writeTagFuntionID = 3;
// 	var writeTagRun = {RUN:1, errRetry:0};
// 	var setWriteFunction = function (data) {
// 		// libInvResult.setDBfunctions(data, writeTagFuntionID, function (err) {
// 		libUtility.setDBfunctions(data, writeTagFuntionID, function (err) {
// //End by Roy for move the function control code to utility.js, 2018-03-07.
// 			// if (err != "") {
// 			// 	if (data.errRetry < 5) {
// 			// 		console.log("Try to set Write Functions for next 100ms..."+data.errRetry);
// 			// 		data.errRetry++;
// 			// 		setTimeout(function (){setWriteFunction(data, writeTagFuntionID)},200);
// 			// 	} else {
// 			// 		DBCount++;
// 			// 		error += err + "\r\n";
// 			// 	}
// 			// } else {
// 			// 	DBCount++;
// 			// }
// 			if (err != "") {
// 				DBCount++;
// 				error += err + "\r\n";
// 			} else {
// 				DBCount++;
// 			}
// 		})
// 	};
// 	var setWriteMethod = function (data) {
// 		libCB2Write.setWriteTag(data, function(err){
// 			if (err != "") {
// 				if (data.errRetry < 5) {
// 					console.log("Try to set Write Method for next 100ms..."+data.errRetry);
// 					data.errRetry++;
// 					setTimeout(function (){setWriteMethod(data)},200);
// 				} else {
// 					DBCount++;
// 					error += err + "\r\n";
// 				}
// 			} else {
// 				setWriteFunction(writeTagRun);
// 			}
// 		})
// 	};
// 	setWriteMethod(params);
//
// 	var response = function () {
// 		if (DBCount < DBNum) {
// 			console.log("Get Processing...");
// 			setTimeout(response, 200);
// 		} else {
// 			DBCount = 0;
// 			if (error == "") {
// 				res.json({
// 					error: "Write Tag Successful!",
// 				});
// 			} else {
// 				res.json({
// 					error: error,
// 				});
// 			}
// 		}
// 	};
// 	response();
// });

router.post('/cb2AdvanceWrite' , function (req, res) {
	var params = JSON.parse(req.body.postData);
	var writeTagData = params;
	var writeTagFuntionID = 3;
	var writeTagRun = {RUN:1, errRetry:0};

	async.waterfall([
		function(next){
			libCB2Write.setWriteTag(writeTagData, function(err){
				if (err != "") {
					res.json({error: err});
				} else {
					next();
				}
			})
		},
		function (next){
			libUtility.setDBfunctions(writeTagRun, writeTagFuntionID, function (err) {
				if (err != "") {
					res.json({error: err});
				} else {
					setTimeout(function () {
						next();
					}, 1000);
				}
			});
		}
	], function(){
		//Add by Roy for insert tag data to database without HEX translation, 2018-04-13.
		libCB2Write.getWriteTag(function (result) {
			if (result.length) {
				res.json({
					//Mod by Roy for follow Tom's decision to modify HEX/ASCII translation, 2018-04-23.
					// tag: result[0].TagFormat,
					// error: result[0].RESULTS
					tagFormat: result[0].TagFormat,
					result: result[0].RESULTS
				});
			} else {
				res.json({
					// error: error,
					error: "Get write tag result fialed!",
					//End by Roy for follow Tom's decision to modify HEX/ASCII translation, 2018-04-23.
				});
			}
		});
		//End by Roy for insert tag data to database without HEX translation, 2018-04-13.
	});
});
// End by Roy for improve code performance by async/retransmission mechanism, 2018-04-13.

module.exports = router;
