var model = require('../models/dbRFTest.js');

function RFTest(){}
//Del by Roy for remove the data getting method that geting from RFID/GPS consolidate table, 2018-09-14.
/*RFTest.prototype.getRFTestInv = function (callback) {
	var result;
	new model.invResults()
	.query(function (qb) {
		qb.orderBy('id');
		qb.limit(1);
	})
	.fetch()
	.then(function (dbData) {
		result = dbData.toJSON();
		callback(result);
	})
	.catch(function (error) {
		console.log("getRFTestInv failed! error log : " + error.message);
		callback([]);
	});
}
RFTest.prototype.getRFTestGPS = function (callback) {
	var result;
	new model.gpsResults()
	.query(function (qb) {
		qb.orderBy('id');
		qb.limit(1);
	})
	.fetch()
	.then(function (dbData) {
		result = dbData.toJSON();
		callback(result);
	})
	.catch(function (error) {
		console.log("getRFTestGPS failed! error log : " + error.message);
		callback([]);
	});
}*/
//End by Roy for remove the data getting method that geting from RFID/GPS consolidate table, 2018-09-14.
RFTest.prototype.getRFTest = function (callback) {
	var result;
	new model.RFTest()
	.query(function (qb) {
		qb.where({id:1});
	})
	.fetch({
		columns: ['PING','RESULTS']
	})
	.then(function (dbData) {
		result = dbData.toJSON();
		callback(result);
	})
	.catch(function (error) {
		console.log("getRFTest failed! error log : " + error.message);
		callback([]);
	});
}
RFTest.prototype.getRegion = function (callback) {
	var result;
	new model.Region()
	.query(function (qb) {
	})
	.fetchAll()
	.then(function (dbData) {
		result = dbData.toJSON();
		callback(result);
	})
	.catch(function (error) {
		console.log("getRFTest failed! error log : " + error.message);
		callback([]);
	});
}
RFTest.prototype.getFreq = function (band ,callback) {
	var result;
	new model.FreqChannel()
	.query(function (qb) {
		qb.where({Band:band});
	})
	.fetchAll()
	.then(function (dbData) {
		result = dbData.toJSON();
		callback(result);
	})
	.catch(function (error) {
		console.log("getRFTest failed! error log : " + error.message);
		callback([]);
	});
}
RFTest.prototype.getFastTID = function (callback) {
	var result;
	new model.inventorylogging()
	.query(function (qb) {
		qb.where({RIOT_ProfileID:1});
	})
	.fetch({
		columns:["RFID_Log_FastTID"]
	})
	.then(function (dbData) {
		result = dbData.toJSON();
		callback(result);
	})
	.catch(function (error) {
		console.log("getFastTID failed! error log : " + error.message);
		callback([]);
	});
}

RFTest.prototype.setRFTest = function (data, callback) {
	var errRetry = 0;
	_setRFTest(data, conti = function (err) {
		if (err != "") {
			if (errRetry < 5) {
				console.log("Try to _setRFTest for next 100ms..."+ errRetry);
				errRetry++;
				setTimeout(function (){_setRFTest(data, conti)},200);
			} else {
				callback(err);
			}
		} else {
			callback(err);
		}
	})
}
function _setRFTest(data, callback) {
	new model.RFTest()
	.query(function (qb) {
		qb.where({id:1});
	})
	.save(data, {method:'update'})
	.then(function () {
		callback("");
	})
	.catch(function (error) {
		callback(error.message);
	});
}

RFTest.prototype.setPING = function (data, callback) {
	var errRetry = 0;
	_setPING(data, conti = function (err) {
		if (err != "") {
			if (errRetry < 5) {
				console.log("Try to _setRFTest for next 100ms..."+ errRetry);
				errRetry++;
				setTimeout(function (){_setPING(data, conti)},200);
			} else {
				callback(err);
			}
		} else {
			callback(err);
		}
	})
}
function _setPING(data, callback) {
	new model.RFTest()
	.query(function (qb) {
		qb.where({id:1});
	})
	.save(data, {method:'update'})
	.then(function () {
		callback("");
	})
	.catch(function (error) {
		callback(error.message);
	});
}

module.exports = new RFTest();
