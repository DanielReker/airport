const {knex} = require("../database");

module.exports = async (tableName, rowId) => {
    await knex.withSchema('domain').from(tableName).where({ id: rowId }).delete();
};