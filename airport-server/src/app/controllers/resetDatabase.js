const { db, getSchemaSql, getSampleDataSql } = require('../database');



module.exports = async (loadSampleData) => {
    try {
        await db.none('DROP SCHEMA domain CASCADE');
    } catch (err) {

    }
    await db.none(getSchemaSql());

    if (loadSampleData) await db.none(getSampleDataSql());
};