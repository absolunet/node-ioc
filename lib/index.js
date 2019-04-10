//--------------------------------------------------------
//-- Node IoC
//--------------------------------------------------------
'use strict';


// Get application constructor
const Application = require('./foundation/Application');


// Create a fresh Application instance
const app = Application.make();


// Exporting the application to allows interactions
module.exports = app;
