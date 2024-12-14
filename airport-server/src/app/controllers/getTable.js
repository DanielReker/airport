const {knex} = require("../database");

module.exports = async (tableName) => {
    const result = await knex.withSchema('domain').select('*').from(tableName);

    return result;
};