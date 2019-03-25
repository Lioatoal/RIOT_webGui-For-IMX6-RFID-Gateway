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


DB.knex.schema.hasTable('tblCB2Control').then(function(exists) {
    if (!exists) {
    	console.log('tblCB2Control is not exist!');
    }
});

DB.knex.schema.hasTable('tblReadTable').then(function(exists) {
    if (!exists) {
    	console.log('tblReadTable is not exist!');
    }
});

DB.knex.schema.hasTable('tblWriteTable').then(function(exists) {
    if (!exists) {
    	console.log('tblReadTable is not exist!');
    }
});

var CB2WriteData = DB.Model.extend({
  tableName: 'tblCB2Control',
  idAttribute: 'ID',
});

var ReadTag = DB.Model.extend({
  tableName: 'tblReadTable',
  idAttribute: 'ID',
});

var WriteTag = DB.Model.extend({
  tableName: 'tblWriteTable',
  idAttribute: 'ID',
});

module.exports = {
  CB2WriteData: CB2WriteData,
  ReadTag: ReadTag,
  WriteTag: WriteTag,
};
