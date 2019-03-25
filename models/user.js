/* MTI CONFIDENTIAL INFORMATION */

var knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: "/riot/webGui/mydb.sqlite"
    },
    useNullAsDefault: true
});

var DB = require('bookshelf')(knex);

var User = DB.Model.extend({
   tableName: 'tblUsers',
   idAttribute: 'userId',
});

module.exports = {
   User: User
};
