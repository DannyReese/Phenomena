// Require the Client constructor from the pg package

// Create a constant, CONNECTION_STRING, from either process.env.DATABASE_URL or postgres://localhost:5432/phenomena-dev

// Create the client using new Client(CONNECTION_STRING)
// Do not connect to the client in this file!

/**
 * Report Related Methods
 */

/**
 * You should select all reports which are open. 
 *  
 * Additionally you should fetch all comments for these
 * reports, and add them to the report objects with a new field, comments.
 * 
 * Lastly, remove the password field from every report before returning them all.
 */

const pg = require('pg')
const { Client } = pg
const addDays = require('date-fns/addDays')
const client = new Client('postgres://localhost:5432/phenomena-dev');


async function getOpenReports() {
  try {
    // first load all of the reports which are open
    const { rows: report } = await client.query(`SELECT * FROM reports`)
    const openReports = report.filter(repo => {
      return repo.isOpen
    })

    const reportIds = report.map(repo => repo.id).join(',')
  

    const { rows: openRepoComments } = await client.query(`SELECT * FROM comments WHERE "reportId" IN(${reportIds})`)

  
    openReports.map(report => {
      report.comments = []
      openRepoComments.map(comment => comment.reportId === report.id ? report.comments.push(comment) : null)
      if (Date.parse(report.expirationDate) >= new Date()) {
        report.isExpired = false
      } else if (Date.parse(report.expirationDate) < new Date()) {
        report.isExpired = true
      }
      delete report.password
    })

 

    return openReports

    // then load the comments only for those reports, using a
    // WHERE "reportId" IN () clause
    // then, build two new properties on each report:
    // .comments for the comments which go with it
    //    it should be an array, even if there are none
    // .isExpired if the expiration date is before now
    //    you can use Date.parse(report.expirationDate) < new Date()
    // also, remove the password from all reports
    // finally, return the reports

  } catch (error) {
    throw error;
  }
}
/**
 * You should use the reportFields parameter (which is
 * an object with properties: title, location, description, password)
 * to insert a new row into the reports table.
 * 
 * On success, you should return the new report object,
 * and on failure you should throw the error up the stack.
 * 
 * Make sure to remove the password from the report object
 * before returning it.
 */
async function createReport(reportFields) {
  // Get all of the fields from the passed in object
  const reportFieldsValues = Object.values(reportFields)

  try {
    // insert the correct fields into the reports table
    // remember to return the new row from the query
    const { rows: [report] } = await client.query(`
    INSERT INTO reports(title,location,description,password)
    VALUES($1,$2,$3,$4)RETURNING id, 
    title,
    location,
    description,
    "isOpen",
    "expirationDate";`, reportFieldsValues)
 

    return report


  } catch (error) {
    throw error;
  }
}

/**
 * NOTE: This function is not for use in other files, so we use an _ to
 * remind us that it is only to be used internally.
 * (for our testing purposes, though, we WILL export it)
 * 
 * It is used in both closeReport and createReportComment, below.
 * 
 * This function should take a reportId, select the report whose 
 * id matches that report id, and return it. 
 * 
 * This should return the password since it will not eventually
 * be returned by the API, but instead used to make choices in other
 * functions.
 */
async function _getReport(reportId) {
  console.log(reportId)
  try {
    // SELECT the report with id equal to reportId
    const { rows: [report] } = await client.query(`SELECT * FROM reports WHERE id=$1`, [reportId]);
    return report
    // return the report
  } catch (error) {
    throw error;
  }
}

/**
 * You should update the report where the reportId 
 * and password match, setting isOpen to false.
 * 
 * If the report is updated this way, return an object
 * with a message of "Success".
 * 
 * If nothing is updated this way, throw an error
 */


async function closeReport(reportId, password) {

  try {

    const reportToClose = await _getReport(reportId)
   if(!reportToClose){
      throw new Error('Report does not exist with that id')
    }else if(reportToClose.password !== password){
      throw new Error('Password incorrect for this report, please try again')
    }else if(reportToClose.isOpen === false){
      throw new Error('This report has already been closed')
    }
    if(reportToClose && reportToClose.password === password){
        reportToClose.isOpen = false
      await client.query(`
      UPDATE reports
      SET "isOpen" = false
      WHERE id=${reportId};`)
     }
    return {message:"Report successfully closed!"}
   
    // If it doesn't exist, throw an error with a useful message


    // If the passwords don't match, throw an error


    // If it has already been closed, throw an error with a useful message


    // Finally, update the report if there are no failures, as above


    // Return a message stating that the report has been closed


  } catch (error) {
    throw error;
  }
}

/**
 * Comment Related Methods
 */

/**
 * If the report is not found, or is closed or expired, throw an error
 * 
 * Otherwise, create a new comment with the correct
 * reportId, and update the expirationDate of the original
 * report to CURRENT_TIMESTAMP + interval '1 day' 
 */
async function createReportComment(reportId, commentFields) {
  // read off the content from the commentFields

  const content = commentFields.content
  try {

    const report = await _getReport(reportId)

    // grab the report we are going to be commenting on
    if (report === undefined) {
      throw new Error(`That report does not exist, no comment has been made`)
    }
    // if it wasn't found, throw an error saying so
    if (report.isOpen === false) {
      throw new Error(`That report has been closed, no comment has been made`)
    }
    // if it is not open, throw an error saying so
    if (Date.parse(report.expirationDate) < new Date()) {
      throw new Error(`The discussion time on this report has expired, no comment has been made`)
    }
    // if the current date is past the expiration, throw an error saying so
    // you can use Date.parse(report.expirationDate) < new Date() to check
    if (report) {
      report.expirationDate = addDays(report.expirationDate, 1)
    }

    const { rows: [comment] } = await client.query(`INSERT INTO comments ("reportId",content)
    VALUES ($1, $2) RETURNING *;`, [reportId, content])

    // then update the expiration date to a day from now
    // finally, return the comment
    return comment
  } catch (error) {
    throw error;
  }
}

// export the client and all database functions below
module.exports = { client, createReport, createReportComment, getOpenReports, _getReport, closeReport }