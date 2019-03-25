/* MTI CONFIDENTIAL INFORMATION */

var model = require('../models/dbInventoryLogging');
function inventorylogging(){}

inventorylogging.prototype.getDBinventorylogging = function (callback) {
	var columns = [
		'RFID_Log_EPC',
		'RFID_Log_FastTID',
		'RFID_Log_PhysAnt',
		'RFID_Log_LogAnt',
		'RFID_Log_RSSI',
		'RFID_Log_Phase',
		'RFID_Log_Freq',
		'RFID_Log_Temp',
		'RIOT_Log_SystemTime',
		'GPS_Log_LatLong',
		'GPS_Log_Altitude',
		'GPS_Log_Time',
		'GPS_Log_Speed',
		'GPS_Log_Heading',
		'GPS_Log_Sats',
		'GPS_Log_Fix',
		'GPS_Log_Hdop',
		'TIMER_GPS',
		'OUTPUT_Webservice',
		'OUTPUT_AWS_Greengrass',
		'OUTPUT_AWS_MQTT',
		'OUTPUT_Bluetooth',
    'OUTPUT_BT_TID', //Add by Roy for add BT TID field, 2018-12-25.
		'OUTPUT_TCP_UDP',
		'OUTPUT_HTTP_POST',
    //Mod by Tom for merge the version of RIOT_20180730, 2018-08-16.
		'RIOT_Write2Sdcard',
		'OUTPUT_DebugMsg',
		'TIMER_Output'
	];
	var result;
	new model.inventorylogging().fetchAll({columns:columns})
	.then(function(dbData) {
		result = dbData.toJSON();
		callback(result);
	//Mod by Roy for show error log if get method return error, 2018-03-28.
	})
	.catch(function (error) {
		console.log("getDBinventorylogging failed! error log : " + error.message);
		callback([]);
	});
	//End by Roy for show error log if get method return error, 2018-03-28.
}

inventorylogging.prototype.setDBinventorylogging = function (inventoryloggingdata, callback) {
	new model.inventorylogging().where({RIOT_ProfileID:1}).save({
		RFID_Log_EPC:inventoryloggingdata.RFIDEPC,
		RFID_Log_FastTID:inventoryloggingdata.RFIDFastTID,
		RFID_Log_PhysAnt:inventoryloggingdata.RFIDPhyAnt,
		RFID_Log_LogAnt:inventoryloggingdata.RFIDLogAnt,
		RFID_Log_RSSI:inventoryloggingdata.RFIDRSSI,
		RFID_Log_Phase:inventoryloggingdata.RFIDPhase,
		RFID_Log_Freq:inventoryloggingdata.RFIDFreq,
		RFID_Log_Temp:inventoryloggingdata.RFIDTemperature,
		RIOT_Log_SystemTime:inventoryloggingdata.RFIDDateTime,
		GPS_Log_LatLong:inventoryloggingdata.GPSLatiLongi,
		GPS_Log_Altitude:inventoryloggingdata.GPSAlti,
		GPS_Log_Time:inventoryloggingdata.GPSTime,
		GPS_Log_Speed:inventoryloggingdata.GPSSpeed,
		GPS_Log_Heading:inventoryloggingdata.GPSHeading,
		GPS_Log_Sats:inventoryloggingdata.GPSSatellites,
		GPS_Log_Fix:inventoryloggingdata.GPSFix,
		GPS_Log_Hdop:inventoryloggingdata.GPSHDOP,
		TIMER_GPS:inventoryloggingdata.GPSThreadSleepTimer,
		OUTPUT_Webservice:inventoryloggingdata.OUTPUTSLocalWebGUI,
		OUTPUT_AWS_Greengrass:inventoryloggingdata.OUTPUTSAWSGreengrass,
		OUTPUT_AWS_MQTT:inventoryloggingdata.OUTPUTSAWSIOTMQTT,
		OUTPUT_Bluetooth:inventoryloggingdata.OUTPUTSBluetooth,
    OUTPUT_BT_TID:inventoryloggingdata.OUTPUTSBluetoothTID, //Add by Roy for add BT TID field, 2018-12-25.
		OUTPUT_TCP_UDP:inventoryloggingdata.OutputsTCPUDPHost,
		OUTPUT_HTTP_POST:inventoryloggingdata.OUTPUTSHTTPPost,
		RIOT_Write2Sdcard:inventoryloggingdata.OUTPUTSSDCard,
		OUTPUT_DebugMsg:inventoryloggingdata.OUTPUTSDEBUGMsg,
    //End by Tom for merge the version of RIOT_20180730, 2018-08-16.
		TIMER_Output:inventoryloggingdata.OUTPUTSThreadSleepTimer},{patch:true})
	.then(function () {
		callback("");
	})
	.catch(function (err){
		callback(err.message);
	});
}

module.exports = new inventorylogging();
