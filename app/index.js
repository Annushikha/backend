// require('../env');

// const express = require('express')
// const path = require('path')
// const mongoose = require('mongoose')
// const cors = require('cors')
// const bodyParser = require('body-parser')


//   mongoose.Promise = global.Promise;
//   mongoose.connect(process.env.DB_URL, { useNewUrlParser: true })
//   .then((x) => {
//     console.log('Database connected')
//   })/Users/yudiz/Documents/Pokerlion/pokerlion-admin-backend-nodejs/index.js
//   .catch((err) => {
//     console.error('Error connecting to mongo', err)
//   })

//   const transRoute = require('./routers/index')
//   const app = express()
//   app.use(bodyParser.json())
//   app.use(
//     bodyParser.urlencoded({
//       extended: false,
//     }),
//   )
//   app.use(cors())
//   app.use('/api', transRoute);

//   const server = app.listen(3000, function () {
//     console.log('Server Lisening On Port : ' + 3000);
//   });

/* eslint-disable no-console */
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const transRoute = require('./routers');

function Router() {
    this.app = express();
    this.httpServer = http.createServer(this.app);
    this.corsOptions = {
        'Access-Control-Allow-Origin': '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Verification'],
        exposedHeaders: ['Authorization', 'Verification'],
    };
}

Router.prototype.initialize = function() {
    this.setupMiddleware();
    this.setupServer();
};

Router.prototype.setupMiddleware = function() {
    this.app.disable('etag');
    this.app.enable('trust proxy');
    this.app.use(cors(this.corsOptions));
    this.app.use(bodyParser.json({ limit: '16mb' }));
    this.app.use(bodyParser.urlencoded({ limit: '16mb', extended: true, parameterLimit: 50000 }));
    this.app.use(express.static('./seed'));
    // this.app.use(this.routeConfig);
    this.app.use('/api', transRoute);

};

Router.prototype.setupServer = function() {
    const httpServer = http.Server(this.app);
    httpServer.timeout = 10000;
    httpServer.listen(process.env.PORT, '0.0.0.0', () => console.log(`Spinning on ${process.env.PORT}`));
};

Router.prototype.routeConfig = function(req, res, next) {
    req.sRemoteAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (req.path === '/ping') return res.status(200).send({});
    res.reply = ({ code, message }, data = {}, header = undefined) => {
        res.status(code)
            .header(header)
            .json({ message, data });
    };
    next();
};

Router.prototype.routeHandler = function(req, res) {
    res.status(404);
    res.send({ message: 'Route not found' });
};



module.exports = new Router();
