/* MTI CONFIDENTIAL INFORMATION */

var model = require('../models/dbInvResults');
var dbConf = require('../models/dbConfiguration'); //Add by Roy for add beep function, 2018-12-25.
var dateFormat = require('dateformat');
var filterData, gpsData;
function invResults(){}
//Mod by Roy for get a interval inventory result, 2018-02-22.
/* invResults.prototype.getDBinvResults = function (currentTime, callback) {
	currentTime = dateFormat(currentTime, "yyyymmddhhMMss");
	console.log("rfid get time:" + currentTime);
	var invData = [];
	new model.filter().fetchAll().then(function(dbData){
		filterData = dbData.toJSON();
		new model.invResults()
		.query(function (qb) {
			for (var i = 0; i < filterData.length; i++) {
				if (filterData[i].Selection) {
					qb.andWhere('EPC', 'like', filterData[i].EPC_Filter);
				}
			}
			qb.andWhere('lastSeen', '>=', currentTime);
		})
		.orderBy('-ID')
		.fetchAll()
		.then(function(dbData) {
			var temp = dbData.toJSON();
			var newTag = true;
			invData.push(temp[0]);
			for (var i in temp) {
				for (var j in invData) {
					if (temp[i].EPC == invData[j].EPC) {
						invData[j].ReadCount += temp[i].ReadCount;
						newTag = false;
						break;
					}
				}
				if (newTag) {
					invData.push(temp[i]);
				}
				newTag = true;
			}
			callback(invData);
		}).catch(function (err) {
			callback({
				error: "No Tags!",
			});
		});
	});
} */
//Del by Roy for remove the data getting method that geting from RFID/GPS consolidate table, 2018-09-14.
/*invResults.prototype.getDBinvResults = function (interval, callback) {
	//Mod by Roy for change 12hour to 24hour clock to consistent with RFID engine, 2018-03-28.
	//var end = dateFormat(interval.end, "yyyymmddhhMMss");
	// Mod by Roy for change interval of inventory by output thread sleep timer, 2018-03-07.
	// if (interval.start == "default") {
	// 	var start = (parseInt(end)-1).toString();
	// } else {
	//var start = dateFormat(interval.start, "yyyymmddhhMMss");
	// }
	// End by Roy for change interval of inventory by output thread sleep timer, 2018-03-07.
	// Mod by Roy for change RunTime format from string to integer, 2018-04-11.
	var start, end;
	if (interval.end) {
		end = dateFormat(interval.end, "yyyymmddHHMMss");
	}
	var start = dateFormat(interval.start, "yyyymmddHHMMss");
	//End by Roy for change 12hour to 24hour clock to consistent with RFID engine, 2018-03-28.
	var invData = [];
	new model.invResults()
	.query(function (qb) {
		qb.where('lastSeen', '>=', start);
		if (end) {
			qb.andWhere('lastSeen', '<', end);
		}
	// End by Roy for change RunTime format from string to integer, 2018-04-11.
	})
	// .orderBy('-ID') Del by Roy for delete inventory descending order, 2018-03-07.
	.fetchAll()
	.then(function(dbData) {
		invData = dbData.toJSON();
		callback(invData);
	}).catch(function (err) {
	//Mod by Roy for show error log if get method return error, 2018-03-28.
		// callback({
		// 	error: "No Tags!",
		// });
		console.log("getDBinvResults failed! error log : " + error.message);
		callback([]);
	});
}*/
//End by Roy for get a interval inventory result, 2018-02-22.

// invResults.prototype.deleteDBinvResults = function (callback){
//     new model.invResults().fetchAll()
// 	.then(function(dbData){
//         for (var i in dbData.models) {
//             dbData.models[i].destroy();
//         }
// 		callback("");
//     })
// 	.catch(function(err){
// 		callback(err.message);
// 	})
// }
// Del by Roy for move the function control code to utility.js, 2018-03-07.
// invResults.prototype.getDBfunctions = function (functionID, callback){
//     new model.rfidFunctions()
// 	.where({FunctionID:functionID})
// 	.fetch()
// 	.then(function (dbData){
// 		var functions = dbData.toJSON();
// 		callback({run:functions.RUN});
// 	})
// 	.catch(function (err) {
// 		callback({error:err.message});
// 	});
// }
// invResults.prototype.setDBfunctions = function (data, functionID, callback){
// 	var run = {
// 		RUN: data.RUN,
// 		StartTime: dateFormat(data.StartTime, "yyyymmddhhMMss"),
// 		RunTime: data.RunTime,
// 	}
//     new model.rfidFunctions().where({FunctionID:functionID})
// 	.save(run, {patch:true})
// 	.then(function (){
// 		callback("");
// 	})
// 	.catch(function (err) {
// 		callback(err.message);
// 	});
// }
//Mod by Roy for get latest GPS data, 2018-02-22.
//invResults.prototype.getGPSResults = function (currentTime, callback) {
	//currentTime = dateFormat(currentTime, "yyyymmddhhMMss");
	//console.log("gps get time:" + currentTime);
/*invResults.prototype.getGPSResults = function (callback) {
	var currentTime = new Date().getTime();
	//Mod by Roy for Change 12hour to 24hour clock to consistent with RFID engine for GPS/CB2Write, 2018-04-11.
	// gpsTime = dateFormat(currentTime-1000, "yyyymmddhhMMss");
	gpsTime = dateFormat(currentTime-1000, "yyyymmddHHMMss");
	//End by Roy for Change 12hour to 24hour clock to consistent with RFID engine for GPS/CB2Write, 2018-04-11.
	console.log("gps get time:" + gpsTime);
	new model.gpsResults()
	.orderBy('-ID')
	.query(function (qb) {
		// qb.andWhere('DateTime', '>=', currentTime);
		qb.andWhere('DateTime', '>=', gpsTime);
//End by Roy for get latest GPS data, 2018-02-22.
	})
	.fetchAll()
	.then(function(dbData) {
		gpsData = dbData.toJSON();
		//if (gpsData.length != 0) {
			//callback(gpsData[0]);
		//} else {
			//callback({error: "No GPS Data!"});
		//}
		callback(gpsData);
	})
	.catch(function (error) {
		//callback({error: err.message});
		console.log("getGPSResults failed! error log : " + error.message);
		callback([]);
	});
}
invResults.prototype.getGPSTimer = function (callback) {
	new model.configuration().where({RIOT_ProfileID:1})
	.fetchAll({columns:["TIMER_GPS"]})
	.then(function (dbData) {
		result = dbData.toJSON();
		//var configuration = dbData.toJSON();
		//callback(configuration.TIMER_GPS);
		callback(result);
	})
	.catch(function (error) {
		console.log("getGPSTimer failed! error log : " + error.message);
		callback([]);
	});
	//End by Roy for show error log if get method return error, 2018-03-28.
}*/
//End by Roy for remove the data getting method that geting from RFID/GPS consolidate table, 2018-09-14.

// invResults.prototype.updateDBinvRun = function(callback){
// 	new model.rfidFunctions().where({FunctionID:1}).fetch()
// 	.then(function(dbData) {
// 		var functions = dbData.toJSON();
// 		callback(functions.RUN);
// 	});
// }
// End by Roy for move the function control code to utility.js, 2018-03-07.

//Add by Roy for add beep function, 2018-12-25.
invResults.prototype.getBeepConf = function(callback){
    new dbConf.configuration().where({RIOT_ProfileID:1})
	.fetchAll({columns:["Beep"]})
	.then(function (dbData) {
		result = dbData.toJSON();
		callback(result);
	})
	.catch(function (error) {
		console.log("getBeepConf failed! error log : " + error.message);
		callback([]);
	});
}
//End by Roy for add beep function, 2018-12-25.
module.exports = new invResults();
