const {knex} = require("../database");

module.exports = async (tableName) => {
    return knex.withSchema('domain').select('*').from(tableName);
};