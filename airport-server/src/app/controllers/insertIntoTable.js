const {knex} = require("../database");

module.exports = async (tableName, rowData) => {
    delete rowData.id;
    const inserted = await knex.withSchema('domain').insert(rowData).into(tableName).returning('*');
    return inserted[0];
};