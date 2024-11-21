const router = require('express').Router();


router.get('/', async (req, res) => {
    let databaseConnected = true;
    try {
        //await sequelize.authenticate();
    } catch (error) {
        databaseConnected = false;
    }
    res.status(200).json({
        uptime: process.uptime(),
        message: 'Ok',
        date: new Date(),
        databaseConnected: databaseConnected
    });
});

module.exports = router;