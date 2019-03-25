/* MTI CONFIDENTIAL INFORMATION */

//Mod by Roy for move db connection to dbConnection.js, 2018-03-28.
// var knex = require('knex')({
//     client: 'sqlite3',
//     connection: {
//         filename: "../RIOT.db3"
//     },
//     useNullAsDefault: true
// });
//
// var DB = require('bookshelf')(knex);
var DB = require('./dbConnection');
//End by Roy for move db connection to dbConnection.js, 2018-03-28.
//Del by Roy for remove the data getting method that geting from RFID/GPS consolidate table, 2018-09-14.
// DB.knex.schema.hasTable('tblConsolidatedInventory').then(function(exists) {
//     if (!exists) {
//     	console.log('tblConsolidatedInventory does not exist!');
//     }
// });

// DB.knex.schema.hasTable('tblConsolidatedGPS').then(function(exists) {
//     if (!exists) {
//     	console.log('tblConsolidatedGPS is not exist!');
//     }
// });
// Mod by Roy for move the function control code to utility.js, 2018-03-07.
// DB.knex.schema.hasTable('tblFilterTable').then(function(exists) {
//     if (!exists) {
//     	console.log('tblFilterTable is not exist!');
//     }
// });
//
// DB.knex.schema.hasTable('tblRfidFunctions').then(function(exists) {
//     if (!exists) {
//     	console.log('tblRfidFunctions is not exist!');
//     }
// });

DB.knex.schema.hasTable('tblConfiguration').then(function (exists) {
    if (!exists) {
    	console.log('tblConfiguration does not exist!');
    }
});

// var invResults = DB.Model.extend({
//    tableName: 'tblConsolidatedInventory',
//    idAttribute: 'ID',
// });

// var gpsResults = DB.Model.extend({
//     tableName: 'tblConsolidatedGPS',
//     idAttribute: 'ID',
// });

// var filter = DB.Model.extend({
//    tableName: 'tblFilterTable',
//    idAttribute: 'ID',
// });
//
// var rfidFunctions = DB.Model.extend({
//    tableName: 'tblRfidFunctions',
//    idAttribute: 'FunctionID',
// });

var configuration = DB.Model.extend({
  tableName: 'tblConfiguration',
  idAttribute: 'RIOT_ProfileID',
});

module.exports = {
	// invResults: invResults,
    // gpsResults : gpsResults,
//End by Roy for remove the data getting method that geting from RFID/GPS consolidate table, 2018-09-14.
    // filter: filter,
    // rfidFunctions: rfidFunctions,
    configuration: configuration,
};
// End by Roy for move the function control code to utility.js, 2018-03-07.
