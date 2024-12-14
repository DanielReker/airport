const router = require('express').Router();
const resetDatabase = require('../controllers/resetDatabase');
const getTablesSchema = require('../controllers/getTablesSchema');
const getTable = require('../controllers/getTable');
const insertIntoTable = require('../controllers/insertIntoTable');
const deleteFromTable = require('../controllers/deleteFromTable');
const updateTable = require('../controllers/updateTable');

router.patch('/', async (req, res) => {
    try {
        if (req.body['action'] === 'reset') {
            await resetDatabase(req.body['loadSampleData']);
            res.status(200).json({ message: 'Ok' });
        } else {
            res.status(400).json({ message: 'Unknown action' });
        }
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const schema = await getTablesSchema();
        res.status(200).json(schema);
    } catch (e) {
        res.status(500).json({ message: 'Internal server error', error: e.message });
    }
});

router.get('/:table', async (req, res) => {
    try {
        const tableName = req.params.table;
        res.status(200).json(await getTable(tableName));
    } catch (err) {
        // TODO: Categorize errors
        res.status(500).json({ error: err.message });
    }
});

router.post('/:table', async (req, res) => {
    try {
        const tableName = req.params.table;
        const rowData = req.body;
        await insertIntoTable(tableName, rowData);
        res.status(200).json({ message: 'Ok' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/:table/:id', async (req, res) => {
    try {
        const tableName = req.params.table;
        const rowId = req.params.id;
        await deleteFromTable(tableName, rowId);
        res.status(200).json({ message: 'Ok' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/:table/:id', async (req, res) => {
    try {
        const tableName = req.params.table;
        const rowId = req.params.id;
        const rowData = req.body;
        await updateTable(tableName, rowId, rowData);
        res.status(200).json({ message: 'Ok' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
