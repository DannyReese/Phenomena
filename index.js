// Use the dotenv package, to create environment variables
require('dotenv').config();
// Create a constant variable, PORT, based on what's in process.env.PORT or fallback to 3000
const PORT = 3000;
const bodyParser = require('body-parser');
// Import express, and create a server
const express = require('express');
const server = express();
// Require morgan and body-parser middleware
const morgan = require('morgan');
// Have the server use morgan with setting 'dev'
server.use(morgan('dev'));
// Import cors 
// Have the server use cors()

// Have the server use bodyParser.json()
server.use(bodyParser.json());
// Have the server use your api router with prefix '/api'

// Import the client from your db/index.js

// Create custom 404 handler that sets the status code to 404.

// Create custom error handling that sets the status code to 500
// and returns the error as an object


// Start the server listening on port PORT
server.listen(PORT, () => {
    console.log(`Server listening in port ${PORT}`);
});
// On success, connect to the database
