/* MTI CONFIDENTIAL INFORMATION */

var model = require('../models/dbCB2Write');
function tagAccess(){}

tagAccess.prototype.getCB2TagData = function (callback) {
	var result;
	new model.invResults().fetchAll().then(function(dbData) {
		result = dbData.toJSON();
		callback(result);
	});
}
tagAccess.prototype.getCB2ControlID = function (callback) {
	var result;
	new model.CB2WriteData().query(function (qb) {
		qb.max('ID as CB2ControlID');
	}).fetchAll().then(function(dbData) {
		result = dbData.toJSON();
		callback(result);
	}).catch(function (err){
//Mod by Roy for improve code performance by async/retransmission mechanism, 2018-04-13.
		console.log(err.message);
		callback([]);
		// callback(err.message);
	});
}
tagAccess.prototype.setCB2Control = function (cb2writedata, callback) {
	// new model.CB2WriteData().save({
	// 	ID:cb2writedata.ID,
	// 	SessionID:cb2writedata.SessionID,
	// 	EPC:cb2writedata.EPC,
	// 	Blink:cb2writedata.Blink,
	// 	Color:cb2writedata.Color,
	// 	Battery:cb2writedata.Battery,
	// 	Antenna:cb2writedata.Antenna,
	// })
	// .then(function () {
	// 	callback("");
	// })
	// .catch(function (err){
	// 	callback(err.message);
	// });
	var errRetry = 0;
	var data = {
		ID:cb2writedata.ID,
		SessionID:1,
		// TagFormat: cb2writedata.TagFormat, //Del by Tom for merge the version of RIOT_20180730, 2018-08-16.
		EPC:cb2writedata.EPC,
		Blink:cb2writedata.Blink,
		Color:cb2writedata.Color,
		Battery:cb2writedata.Battery,
		Antenna:cb2writedata.Antenna,
	};
	_setCB2Control(data, conti = function (err) {
		if (err != "") {
			if (errRetry < 5) {
				console.log("Try to _setCB2Control for next 100ms..."+ errRetry);
				errRetry++;
				setTimeout(function (){_setCB2Control(data, conti)},200);
			} else {
				callback(err);
			}
		} else {
			callback("");
		}
	});
}

tagAccess.prototype.getReadTag = function (callback) {
	var result;
	// new model.ReadTag().where({ID:1}).fetch({columns: ['RESULT']}).
	// then(function(dbData) {
	//	result = dbData.toJSON();
	//	callback(result);
	// })
	// .catch(function (err){
	//	callback({error:err.message});
	// });
	new model.ReadTag().where({ID:1})
	.fetchAll({
		columns: ['TagFormat','RESULT']
	})
	.then(function(dbData) {
		result = dbData.toJSON();
		callback(result);
	})
	.catch(function (err){
		// callback({error:err.message});
		console.log(err.message);
		callback([]);
	});
}
tagAccess.prototype.setReadTag = function (data, callback) {
	var errRetry = 0;
	_setReadTag(data, conti = function (err) {
		if (err != "") {
			if (errRetry < 5) {
				console.log("Try to _setCB2Control for next 100ms..."+ errRetry);
				errRetry++;
				setTimeout(function (){_setReadTag(data, conti)},200);
			} else {
				callback(err);
			}
		} else {
			callback("");
		}
	});
}
tagAccess.prototype.getWriteTag = function (callback) {
	var result;
	new model.WriteTag().where({ID:1})
	.fetchAll({
    //Del by Tom, 2018-12-25.
    //columns: ['TagFormat','RESULTS']
		columns: ['TagFormat','RESULT']
    //End by Tom, 2018-12-25.
	})
	.then(function(dbData) {
		result = dbData.toJSON();
		callback(result);
	})
	.catch(function (err){
		console.log(err.message);
		callback([]);
	});
}
tagAccess.prototype.setWriteTag = function (data, callback) {
	// var count = data.errRetry;
	// delete data.errRetry;
	// new model.ReadTag().where({ID:1}).save(data, {patch:true})
	// .then(function () {
	// 	callback("");
	// })
	// .catch(function (err){
	// 	data.errRetry = count;
	// 	callback(err.message);
	// });
	var errRetry = 0;
	_setWriteTag(data, conti = function (err) {
		if (err != "") {
			if (errRetry < 5) {
				console.log("Try to _setCB2Control for next 100ms..."+ errRetry);
				errRetry++;
				setTimeout(function (){_setReadTag(data, conti)},200);
			} else {
				callback(err);
			}
		} else {
			callback("");
		}
	});
}

function _setCB2Control(data, callback) {
	new model.CB2WriteData()
  //Mod by Roy for make sure data is used insert method in the database, 2018-08-29.
  //.save(data)
	.save(data, {method:'insert'}) 
  //End by Roy for make sure data is used insert method in the database, 2018-08-29.
	.then(function () {
		callback("");
	})
	.catch(function (err){
		callback(err.message);
	});
}
function _setReadTag(data, callback) {
	new model.ReadTag().where({ID:1})
	.save(data, {patch:true})
	.then(function () {
		callback("");
	})
	.catch(function (err){
		//Mod by Roy for prevent from tblReadTable and tblWriteTable are empty, 2018-08-16.
		if (err.message === "No Rows Updated") {
			console.log("No Rows to update, creating...")
			data.id = 1;
			new model.ReadTag().save(data, {method:"insert"})
			.then(function () {
				callback("");
			})
			.catch(function (err) {
				callback(err.message);
			})
		} else {
			callback(err.message);
		}
		//End by Roy for prevent from tblReadTable and tblWriteTable are empty, 2018-08-16.
	});
}
function _setWriteTag(data, callback) {
	new model.WriteTag().where({ID:1})
	.save(data, {patch:true})
//End by Roy for improve code performance by async/retransmission mechanism, 2018-04-13.
	.then(function () {
		callback("");
	})
	.catch(function (err){
		//Mod by Roy for prevent from tblReadTable and tblWriteTable are empty, 2018-08-16.
		if (err.message === "No Rows Updated") {
			console.log("No Rows to update, creating...");
			data.id = 1;
			new model.WriteTag().save(data, {method:"insert"})
			.then(function () {
				callback("");
			})
			.catch(function (err) {
				callback(err.message);
			})
		} else {
			callback(err.message);
		}
		//End by Roy for prevent from tblReadTable and tblWriteTable are empty, 2018-08-16.
	});
}

module.exports = new tagAccess();
