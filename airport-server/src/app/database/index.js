const dbPassword = require("node:fs").readFileSync('/run/secrets/db-password', 'utf8');
const connection = {
    host: 'database',
    port: 5432,
    user: 'postgres',
    database: 'airport_dev',
    password: dbPassword,
};
const knex = require('knex')({
    client: 'pg',
    connection: connection
});
const pgp = require('pg-promise')();
const db = pgp(connection);
const {QueryFile} = require('pg-promise');
const {join: joinPath} = require('path');

function sql(file) {
    const fullPath = joinPath(__dirname, file); // Generating full path;
    return new QueryFile(fullPath, {minify: true});
}

const getSchemaSql = () => sql('./schema.sql');
const getSampleDataSql = () => sql('./sampleData.sql');


const cleanDatabase = async () => {
    try {
        await db.none('DROP SCHEMA domain CASCADE');
    } catch (e) {
        // Do nothing, assuming domain schema does not exist
    }
};

const createDatabaseSchema = async () => {
    await db.none(getSchemaSql());
};

const loadSampleData = async () => {
    await db.none(getSampleDataSql());
};


module.exports = {
    knex, cleanDatabase, createDatabaseSchema, loadSampleData
};
