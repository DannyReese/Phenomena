require('dotenv').config();
const PORT = 3000;
const bodyParser = require('body-parser');
const express = require('express');
const server = express();
const morgan = require('morgan');
server.use(morgan('dev'));
// Import cors 
// Have the server use cors()

// Have the server use bodyParser.json()
server.use(bodyParser.json());
// Have the server use your api router with prefix '/api'

// Import the client from your db/index.js
import { db } from './db/index';
// Create custom 404 handler that sets the status code to 404.

// Create custom error handling that sets the status code to 500
// and returns the error as an object


server.listen(PORT, () => {
    console.log(`Server listening in port ${PORT}`);
});
// On success, connect to the database
