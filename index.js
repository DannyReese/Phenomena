require('dotenv').config();
const PORT = 3000;
const bodyParser = require('body-parser');
const express = require('express');
const server = express();
const morgan = require('morgan');
server.use(morgan('dev'));
const cors = require('cors');
server.use(cors());
server.use(bodyParser.json());
const apiRouter = require('./api');
server.use(apiRouter);
// Import the client from your db/index.js

// Create custom 404 handler that sets the status code to 404.

// Create custom error handling that sets the status code to 500
// and returns the error as an object


server.listen(PORT, () => {
    console.log(`Server listening in port ${PORT}`);
});
// On success, connect to the database
