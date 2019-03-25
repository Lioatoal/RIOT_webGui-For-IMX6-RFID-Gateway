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

DB.knex.schema.hasTable('tblConfiguration').then(function(exists) {
    if (!exists) {
    	console.log('tblConfiguration is not exist!');
    }
});

var inventorylogging = DB.Model.extend({
  tableName: 'tblConfiguration',
  idAttribute: 'RIOT_ProfileID',
});

module.exports = {
  inventorylogging: inventorylogging,
};
