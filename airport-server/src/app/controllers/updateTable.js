const {knex} = require("../database");

module.exports = async (tableName, rowId, rowData) => {
    await knex.withSchema('domain').from(tableName).where({ id: rowId }).update(rowData);
};