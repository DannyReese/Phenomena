// Use the dotenv package, to create environment variables

// Create a constant variable, PORT, based on what's in process.env.PORT or fallback to 3000

// Import express, and create a server

// Require morgan and body-parser middleware

// Have the server use morgan with setting 'dev'

// Import cors 
// Have the server use cors()

// Have the server use bodyParser.json()

// Have the server use your api router with prefix '/api'

// Import the client from your db/index.js

// Create custom 404 handler that sets the status code to 404.

// Create custom error handling that sets the status code to 500
// and returns the error as an object


// Start the server listening on port PORT
// On success, connect to the database
require('dotenv').config()
const express = require('express');
const morgan = require('morgan');
const server = express();
const cors = require('cors')
const {apiRouter} = require('./api')
const {client} = require('./db/index')
const PORT = process.env.PORT;


server.use(morgan('dev'));
server.use(express.json());

server.use(cors())
// server.use('/api')

server.use((req,res,next)=>{
    console.log('beginning apiRouter')
    next()
})
server.use('/api',apiRouter)

server.listen(PORT,()=>{
    console.log('listening to ' + PORT)
    client.connect()
})
