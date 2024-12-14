const {knex} = require("../database");

module.exports = async (tableName, rowData) => {
    delete rowData.id;
    await knex.withSchema('domain').insert(rowData).into(tableName);
};