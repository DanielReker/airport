const { knex } = require('../database')


module.exports = async () => {
    let healthInfo = {
        uptime: process.uptime(),
        date: new Date(),
        databaseHealthy: true,
        databaseError: null,
    }

    try {
        const res = await knex.raw('SELECT current_timestamp');
    } catch (e) {
        healthInfo.databaseHealthy = false;
        healthInfo.databaseError = e.message;
    }

    return healthInfo;
};