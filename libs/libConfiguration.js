/* MTI CONFIDENTIAL INFORMATION */

var model = require('../models/dbConfiguration');
function configuration(){}

configuration.prototype.getDBconfiguration = function (callback) {
	var result;
	new model.configuration().fetchAll().then(function(dbData) {
		result = dbData.toJSON();
		callback(result);
	//Mod by Roy for show error log if get method return error, 2018-03-28.
	})
	.catch(function (error) {
		console.log("getDBconfiguration failed! error log : " + error.message);
		callback([]);
	});
	//End by Roy for show error log if get method return error, 2018-03-28.
}

configuration.prototype.setDBconfiguration = function (configurationdata, callback) {
	new model.configuration().where({RIOT_ProfileID:1}).save({
		WiFi_SSID:configurationdata.WiFiSSID,
        WiFi_Password: configurationdata.WiFiPassword,
        WiFi_Security: configurationdata.WiFiSecurity,
		BluetoothMAC:configurationdata.BlueToothMAC,
		BluetoothPair:configurationdata.Btpaircode, //Add by Wayne for adding pairing code of BT, 2018-12-21
		TCP_UDP_HOST_IP:configurationdata.TCP_UDP_IP,
		TCP_UDP_HOST_PORT:configurationdata.TCP_UDP_Port,
		HTTP_POST_URL:configurationdata.HttpPostURL,
		HTTP_POST_PORT :configurationdata.HttpPostPort,
		HTTP_POST_Fields:configurationdata.HttpPostFields,
		HTTP_POST_HeartBeat:configurationdata.HttpPostHeartBeat,
        Language:configurationdata.Language, //Add by Roy for add language package, 2019-02-15.
        Beep: configurationdata.AnnounceBeep //Add by Roy for add Beep function, 2018-12-25.
	},{patch:true})
	.then(function () {
		callback("");
	})
	.catch(function (err){
		callback(err.message);
	});
}
//Add by Roy for add language package, 2019-02-15.
configuration.prototype.getDBConfLang = function (callback) {
    let result;
    new model.configuration().fetch(
        {columns: ['Language']}
    ).then(function(dbData) {
        result = dbData.toJSON();
        callback(result);
    })
    .catch(function (error) {
        console.log("getDBConfLang failed! error log : " + error.message);
        callback([]);
    });
}
//End by Roy for add language package, 2019-02-15.
module.exports = new configuration();
