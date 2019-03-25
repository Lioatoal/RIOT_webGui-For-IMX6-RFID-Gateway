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

DB.knex.schema.hasTable('tblFilterTable').then(function(exists) {
    if (!exists) {
    	console.log('tblFilterTable is not exist!');
    }
});

var filter = DB.Model.extend({
   tableName: 'tblFilterTable',
   idAttribute: 'ID',
});

module.exports = {
    filter: filter,
};
