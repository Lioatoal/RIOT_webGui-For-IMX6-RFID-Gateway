var knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: "/riot/RIOT.db3"
    },
    useNullAsDefault: true
});

var database = require('bookshelf')(knex);

module.exports = database;
