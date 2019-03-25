/* MTI CONFIDENTIAL INFORMATION */

var model = require('../models/dbTagFilter');
function tagFilter(){}

tagFilter.prototype.getDBtagFilter = function (callback) {
    var filterData;
    new model.filter().fetchAll().then(function (dbData) {
        filterData = dbData.toJSON();
        callback(filterData);
    //Mod by Roy for show error log if get method return error, 2018-03-28.
    })
    .catch(function (error) {
		console.log("getDBtagFilter failed! error log : " + error.message);
		callback([]);
    });
    //End by Roy for show error log if get method return error, 2018-03-28.
}
tagFilter.prototype.setDBtagFilter = function (data, callback) {
    var count = data.errRetry;
	delete data.errRetry;
    new model.filter()
    .save(data,{patch:true})
    .then(function () {
        callback("");
    })
    .catch(function (err) {
        data.errRetry = count;
        callback(err.message);
    });
}

module.exports = new tagFilter();
