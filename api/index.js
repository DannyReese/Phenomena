// Build an apiRouter using express Router
/**
 * 
 * 
 * Set up a GET request for /reports
 * 
 * - it should use an async function
 * - it should await a call to getOpenReports
 * - on success, it should send back an object like { reports: theReports }
 * - on caught error, call next(error)
 */
// Import the database adapter functions from the db
const express = require('express')
const apiRouter = express.Router()
const { getOpenReports, createReport } = require('../db/index')


apiRouter.use((req, res, next) => {
    console.log('making call to routes')
    next()
})



apiRouter.get('/reports', async (req, res, next) => {
    try {
        const openReports = await getOpenReports()
        res.send({ reports: openReports })
    } catch ({ name, message }) {
        next({
            name: 'No Reports',
            message: 'Cant get reports'
        })
    }
})

apiRouter.post('/reports', async (req, res, next) => {
    try {
        const { title, location, description, password } = req.body
        const field = {}
        if (title) {
            field.title = title
        } else {
            throw new Error('must have title')
        }
        if (location) {
            field.location = location
        } else {
            throw new Error('must have location')
        }
        if (description) {
            field.description = description
        } else {
            throw new Error('must have description')
        }
        if (password) {
            field.password = password
        } else {
            throw new Error('must have password')
        }
        const newReport = await createReport(field)
        res.send(newReport)
    } catch (error) {
        next(error)
    }
})
/**
 * Set up a POST request for /reports
 * 
 * - it should use an async function
 * - it should await a call to createReport, passing in the fields from req.body
 * - on success, it should send back the object returned by createReport
 * - on caught error, call next(error)
 */



/**
 * Set up a DELETE request for /reports/:reportId
 * 
 * - it should use an async function
 * - it should await a call to closeReport, passing in the reportId from req.params
 *   and the password from req.body
 * - on success, it should send back the object returned by closeReport
 * - on caught error, call next(error)
 */



/**
 * Set up a POST request for /reports/:reportId/comments
 * 
 * - it should use an async function
 * - it should await a call to createReportComment, passing in the reportId and
 *   the fields from req.body
 * - on success, it should send back the object returned by createReportComment
 * - on caught error, call next(error)
 */

module.exports = { apiRouter }

// Export the apiRouter
