require('./env');

const { mongodb} = require('./app/utils');
const router = require('./app');

mongodb.initialize();
router.initialize();
