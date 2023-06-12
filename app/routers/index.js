const router = require('express').Router();

const controllers = require('./lib/controllers');
const middlewares = require('./lib/middlewares');

router.get('/', controllers.dashboard);

module.exports = router;
