const router = require('express').Router();
const resetDatabase = require('../controllers/resetDatabase');
const {pgp, db} = require('../database');
const {raw} = require("express");

const toSentenceCase = str => {
    const s =
        str &&
        str
            .match(
                /[A-Z]{2,}(?=[A-Z][a-z,]+[0-9]*|\b)|[A-Z]?[a-z,]+[0-9]*|[A-Z]|[0-9]+/g
            )
            .join(' ');
    return s.slice(0, 1).toUpperCase() + s.slice(1);
};

const prettifyString = str => {
    return toSentenceCase(str.replace('_kg', ',_kg').replace('_km', ',_km')).replace('id', 'ID').replace('Iata', 'IATA').replace('Icao', 'ICAO');
};


router.patch('/', async (req, res) => {
    try {
        if (req.body['action'] === 'reset') {
            await resetDatabase(req.body['loadSampleData']);
            res.status(200).json({ message: 'Ok' });
        }
    } catch (e) {
        res.status(500).json({ message: 'Internal server error', error: e.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const raw_columns = await db.any(`
            SELECT
                c.table_name,
                c.column_name,
                c.column_default,
                c.is_nullable,
                c.data_type,
                t.table_type,
                c.ordinal_position
            FROM information_schema.columns c JOIN information_schema.tables t
                ON c.table_name = t.table_name
            WHERE c.table_schema = 'domain';
        `);

        let tables = {};

        for (const raw_column_id in raw_columns) {
            const raw_column = raw_columns[raw_column_id];

            if (!tables[raw_column['table_name']]) {
                tables[raw_column['table_name']] = {
                    name: raw_column['table_name'],
                    printableName: prettifyString(raw_column['table_name']),
                    type: raw_column['table_type'] === 'VIEW' ? 'view' : 'table',
                    columns: {},
                };
            }

            tables[raw_column['table_name']].columns[raw_column['column_name']] = {
                name: raw_column['column_name'],
                printableName: prettifyString(raw_column['column_name']),
                position: raw_column['ordinal_position']
                //default: raw_column['column_default'],
                //isNullable: raw_column['is_nullable'] === 'YES',
                //data_type: raw_column['data_type'],
            };
        }

        res.status(200).json(tables);
    } catch (e) {
        res.status(500).json({ message: 'Internal server error', error: e.message });
    }
});

router.get('/:table', async (req, res) => {
    try {
        const table = new pgp.helpers.TableName({ table: req.params.table, schema: 'domain' })
        const result = await db.any('SELECT * FROM $1', table);
        for (const i in result) {
            result[i].id = i;
        }
        res.status(200).json(result);
    } catch (err) {
        res.status(404).json({ message: 'Requested table does not exist', error: err.message });
    }
});

module.exports = router;
