var model = require('../models/dbUtility');
var dateFormat = require('dateformat');

function utility(){}

utility.prototype.getDBfunctions = function (functionID, callback){
    new model.functions()
	.where({FunctionID:functionID})
	.fetch()
	.then(function (dbData){
		var functions = dbData.toJSON();
		callback({run:functions.RUN});
	})
	.catch(function (err) {
		callback({error:err.message});
	});
}
utility.prototype.setDBfunctions = function (data, functionID, callback){
// Mod by Roy for improve code performance by async/retransmission mechanism, 2018-04-13.
	var errRetry = 0;
	var run = {
		RUN: data.RUN,
		//Mod by Roy for Change 12hour to 24hour clock to consistent with RFID engine for GPS/CB2Write, 2018-04-11.
		// StartTime: dateFormat(data.StartTime, "yyyymmddhhMMss"),
		StartTime: dateFormat(data.StartTime, "yyyymmddHHMMss"),
		//End by Roy for Change 12hour to 24hour clock to consistent with RFID engine for GPS/CB2Write, 2018-04-11.
		RunTime: data.RunTime
	}
    // new model.functions().where({FunctionID:functionID})
	// .save(run, {patch:true})
	// .then(function (data){
	// 	callback("");
	// })
	// .catch(function (err) {
	// 	callback(err.message);
	// });
    _setDBfunctions(run, functionID, conti = function (err) {
        if (err != "") {
            if (errRetry < 5) {
                console.log("Try to _setDBfunctions for next 100ms..."+ errRetry);
                errRetry++;
                setTimeout(function (){_setDBfunctions(run, functionID, conti)},200);
            } else {
                callback(err);
            }
        } else {
            callback(err);
        }
    });
}
utility.prototype.initDBfunctions = function (callback) {
    var run = {
		RUN: 0,
		StartTime: null,
		RunTime: null,
	}
    new model.functions()
    .where('FunctionID', '!=', 0)
	.save(run, {patch:true})
	.then(function (){
		callback("");
	})
	.catch(function (err) {
		callback(err.message);
	});
}

utility.prototype.setConfiguration = function (configRun, callback) {
    initFunctions(configRun, function (err) {
        if (err != "") {
            callback(err);
        } else {
            var functionID = 14;
            configRun.errRetry = 0;
            // setConfigFunction(configRun, function (err) {
            //     callback(err);
            // })
            utility.prototype.setDBfunctions(configRun, functionID, function (err) {
		callback(err);
	    });
        }
    });
}

function initFunctions(data, callback) {
    utility.prototype.initDBfunctions(function (err) {
        if (err != "") {
            if (data.errRetry < 5) {
                console.log("Try to init Config Function for next 100ms..."+data.errRetry);
                data.errRetry++;
                setTimeout(function (){initFunctions(data, callback)},200);
            } else {
                callback(err);
            }
        } else {
            callback(err);
        }
    });
}
// function setConfigFunction(data, callback) {
//     var functionID = 14;
//     utility.prototype.setDBfunctions(data, functionID, function (err) {
//         if (err != "") {
//             if (data.errRetry < 5) {
//                 console.log("Try to set Config Function for next 100ms..."+data.errRetry);
//                 data.errRetry++;
//                 setTimeout(function (){setConfigFunction(data, callback)},200);
//             } else {
//                 callback(err);
//             }
//         } else {
//             callback(err);
//         }
//     });
// }
function _setDBfunctions(data, functionID, callback) {
    new model.functions().where({FunctionID:functionID})
    .save(data, {patch:true})
    .then(function (){
        callback("");
    })
    .catch(function (err) {
        callback(err.message);
// End by Roy for improve code performance by async/retransmission mechanism, 2018-04-13.
    });
}

module.exports = new utility();
