/* MTI CONFIDENTIAL INFORMATION */

var model = require('../models/dbAntenna');
function antenna(){}

antenna.prototype.getDBprofileID = function (callback) {
	var result;
	new model.config()
	.query(function (qb) {
		qb.column('RIOT_ProfileID');
	})
	.fetchAll()
	.then(function (dbData) {
		result = dbData.toJSON();
		callback(result);
	//Mod by Roy for show error log if get method return error, 2018-03-28.
	})
	.catch(function (error) {
		console.log("getDBprofileID failed! error log : " + error.message);
		callback([]);
	});
}

antenna.prototype.getDBsingulation = function (callback) {
	var result;
	new model.singulation().fetchAll().then(function(dbData) {
		result = dbData.toJSON();
		callback(result);
	})
	.catch(function (error) {
		console.log("getDBsingulation failed! error log : " + error.message);
		callback([]);
	});
}

antenna.prototype.setDBsingulation = function (data, callback) {
	var count = data.errRetry;
	delete data.errRetry;
	new model.singulation().where({ID:1}).save(data, {patch:true})
	.then(function () {
		callback("");
	})
	.catch(function (err) {
		data.errRetry = count;
		callback(err.message);
	});
}

antenna.prototype.getDBantenna = function (callback) {
	var result;
	new model.antenna().fetchAll().then(function(dbData) {
		result = dbData.toJSON();
		callback(result);
	})
	.catch(function (error) {
		console.log("getDBantenna failed! error log : ");
		console.log(error.message);
		callback([]);
	});
	//End by Roy for show error log if get method return error, 2018-03-28.
}

antenna.prototype.setDBantenna = function (data, callback) {
	var count = data.errRetry;
	delete data.errRetry;
	new model.antenna()
	.save(data, {patch:true})
	.then(function () {
		callback("");
	})
	.catch(function (err) {
		data.errRetry = count;
		callback(err.message);
	});
}

module.exports = new antenna();
