const { knex, cleanDatabase, createDatabaseSchema, loadSampleData } = require('../database');

module.exports = async (shouldLoadSampleData) => {
    try {
        await cleanDatabase();
        await createDatabaseSchema();
        if (shouldLoadSampleData) {
            await loadSampleData();
        }
    } catch (e) {
        console.log(`Error trying to reset database: ${e.message}`)
    }
};