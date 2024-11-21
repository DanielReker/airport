//const {Sequelize, DataTypes} = require("sequelize");


const dbPassword = require("node:fs").readFileSync('/run/secrets/db-password', 'utf8');

const pgp = require('pg-promise')();
const db = pgp({
    host: 'database',
    port: 5432,
    database: 'airport_dev',
    password: dbPassword,
    user: 'postgres',
});

const {QueryFile} = require('pg-promise');
const {join: joinPath} = require('path');

function sql(file) {
    const fullPath = joinPath(__dirname, file); // generating full path;
    return new QueryFile(fullPath, {minify: true});
}

const getSchemaSql = () => sql('./schema.sql');
const getSampleDataSql = () => sql('./sampleData.sql');

module.exports = {
    db, pgp, getSchemaSql, getSampleDataSql
};

// const sequelize = new Sequelize({
//     dialect: 'postgres',
//     host: 'database',
//     port: 5432,
//     database: 'airport_dev',
//     username: 'postgres',
//     password: dbPassword
// });
//
//
// const Airport = sequelize.define('Airport', {
//     icao_code: {
//         type: DataTypes.STRING(4),
//         primaryKey: true,
//         validate: { is: /^[A-Z]{4}$/ },
//     },
//     iata_code: {
//         type: DataTypes.STRING(3),
//         unique: true,
//         validate: { is: /^[A-Z]{3}$/ },
//     },
//     airport_name: DataTypes.TEXT,
//     address: DataTypes.TEXT,
//     lat: DataTypes.DOUBLE,
//     lon: DataTypes.DOUBLE,
// }, { tableName: 'airports', timestamps: false });
//
// const AircraftModel = sequelize.define('AircraftModel', {
//     model_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
//     manufacturer: { type: DataTypes.TEXT, allowNull: false },
//     model_name: { type: DataTypes.TEXT, allowNull: false },
//     iata_code: {
//         type: DataTypes.STRING(3),
//         unique: true,
//         validate: { is: /^[A-Z0-9]{3}$/ },
//     },
//     seats_number: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         defaultValue: 0,
//         validate: { min: 0 },
//     },
//     load_capacity_kg: { type: DataTypes.INTEGER, validate: { min: 1 } },
// }, {
//     tableName: 'aircraft_models',
//     timestamps: false,
//     indexes: [{ unique: true, fields: ['manufacturer', 'model_name'] }],
// });
//
// const Aircraft = sequelize.define('Aircraft', {
//     aircraft_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
//     model_id: { type: DataTypes.INTEGER, references: { model: AircraftModel, key: 'model_id' } },
//     base_airport: { type: DataTypes.STRING(4), references: { model: Airport, key: 'icao_code' } },
// }, { tableName: 'aircrafts', timestamps: false });
//
// const Personnel = sequelize.define('Personnel', {
//     passport_series: { type: DataTypes.DECIMAL(4), validate: { min: 0 } },
//     passport_number: { type: DataTypes.DECIMAL(6), validate: { min: 0 } },
//     inn: {
//         type: DataTypes.DECIMAL(12),
//         allowNull: false,
//         unique: true,
//         validate: { min: 0 },
//     },
//     first_name: { type: DataTypes.TEXT, allowNull: false },
//     last_name: { type: DataTypes.TEXT, allowNull: false },
//     patronymic: DataTypes.TEXT,
//     job_position: { type: DataTypes.TEXT, allowNull: false },
//     salary: { type: DataTypes.DECIMAL(20, 2) },
//     airport_code: {
//         type: DataTypes.STRING(4),
//         allowNull: false,
//         references: { model: Airport, key: 'icao_code' },
//     },
// }, {
//     tableName: 'personnel',
//     timestamps: false,
//     primaryKey: {
//         name: 'personnel_pkey',
//         fields: ['passport_series', 'passport_number'],
//     },
// });
//
// const Route = sequelize.define('Route', {
//     route_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
//     from_airport_id: {
//         type: DataTypes.STRING(4),
//         allowNull: false,
//         references: { model: Airport, key: 'icao_code' },
//     },
//     to_airport_id: {
//         type: DataTypes.STRING(4),
//         allowNull: false,
//         references: { model: Airport, key: 'icao_code' },
//     },
//     distance_km: {
//         type: DataTypes.DECIMAL(8, 3),
//         allowNull: false,
//         validate: { min: 0.001 },
//     },
// }, { tableName: 'routes', timestamps: false });
//
// const Flight = sequelize.define('Flight', {
//     flight_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
//     aircraft_id: { type: DataTypes.INTEGER, references: { model: Aircraft, key: 'aircraft_id' } },
//     route_id: { type: DataTypes.INTEGER, references: { model: Route, key: 'route_id' } },
//     scheduled_departure_time: { type: DataTypes.DATE, allowNull: false },
//     scheduled_arrival_time: { type: DataTypes.DATE, allowNull: false },
//     actual_departure_time: DataTypes.DATE,
//     actual_arrival_time: DataTypes.DATE,
//     passengers_number: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         defaultValue: 0,
//         validate: { min: 0 },
//     },
//     load_kg: { type: DataTypes.INTEGER, validate: { min: 1 } },
// }, { tableName: 'flights', timestamps: false });
//
// const FlightCrew = sequelize.define('FlightCrew', {
//     flight_id: { type: DataTypes.INTEGER, references: { model: Flight, key: 'flight_id' } },
//     passport_series: { type: DataTypes.DECIMAL(4) },
//     passport_number: { type: DataTypes.DECIMAL(6) },
// }, {
//     tableName: 'flight_crews',
//     timestamps: false,
//     primaryKey: {
//         name: 'flight_crew_pkey',
//         fields: ['flight_id', 'passport_series', 'passport_number'],
//     },
// });
//
// module.exports = sequelize;
