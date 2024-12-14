const { knex, cleanDatabase, createDatabaseSchema, loadSampleData } = require('../database');

module.exports = async (shouldLoadSampleData) => {
    await cleanDatabase();
    await createDatabaseSchema();
    if (shouldLoadSampleData) {
        await loadSampleData();
    }
};