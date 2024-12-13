const {knex} = require("../database");

module.exports = async (tableName) => {
    const result = await knex.withSchema('domain').select('*').from(tableName);

    // Assign unique sequential IDs for frontend
    for (const i in result) {
        result[i].id = i;
    }

    return result;
};