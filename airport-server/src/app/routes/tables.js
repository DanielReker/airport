const router = require('express').Router();
const resetDatabase = require('../controllers/resetDatabase');
const getTablesSchema = require('../controllers/getTablesSchema');
const getTable = require('../controllers/getTable');

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

module.exports = router;
