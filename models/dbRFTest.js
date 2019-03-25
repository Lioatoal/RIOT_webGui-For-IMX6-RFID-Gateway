/* MTI CONFIDENTIAL INFORMATION */

var DB = require('./dbConnection');
//Del by Roy for remove the data getting method that geting from RFID/GPS consolidate table, 2018-09-14.
// DB.knex.schema.hasTable('tblConsolidatedInventory').then(function(exists) {
//     if (!exists) {
//     	console.log('tblConsolidatedInventory is not exist!');
//     }
// });

// DB.knex.schema.hasTable('tblConsolidatedGPS').then(function(exists) {
//     if (!exists) {
//     	console.log('tblConsolidatedGPS is not exist!');
//     }
// });

DB.knex.schema.hasTable('tblRFTests').then(function(exists) {
    if (!exists) {
    	console.log('tblRFTests is not exist!');
    }
});

DB.knex.schema.hasTable('tblRegion').then(function(exists) {
    if (!exists) {
    	console.log('tblRegion is not exist!');
    }
});

DB.knex.schema.hasTable('tblFrequencyChannel').then(function(exists) {
    if (!exists) {
    	console.log('tblFrequencyChannel is not exist!');
    }
});

DB.knex.schema.hasTable('tblConfiguration').then(function(exists) {
    if (!exists) {
    	console.log('tblConfiguration is not exist!');
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

var RFTest = DB.Model.extend({
  tableName: 'tblRFTests',
  idAttribute: 'ID',
});

var Region = DB.Model.extend({
  tableName: 'tblRegion',
  idAttribute: 'BAND',
});

var FreqChannel = DB.Model.extend({
  tableName: 'tblFrequencyChannel',
  idAttribute: 'ID',
});

var inventorylogging = DB.Model.extend({
  tableName: 'tblConfiguration',
  idAttribute: 'RIOT_ProfileID',
});

module.exports = {
    // invResults: invResults,
    // gpsResults: gpsResults,
//End by Roy for remove the data getting method that geting from RFID/GPS consolidate table, 2018-09-14.
    RFTest: RFTest,
    Region: Region,
    FreqChannel: FreqChannel,
    inventorylogging: inventorylogging
};
