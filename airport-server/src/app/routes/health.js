const router = require('express').Router();
const getHealthInfo = require('../controllers/getHealthInfo');


router.get('/', async (req, res) => {
    res.status(200).json(await getHealthInfo());
});

module.exports = router;