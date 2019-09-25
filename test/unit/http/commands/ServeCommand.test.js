//--------------------------------------------------------
//-- Tests - Unit - HTTP - Commands - Serve Command
//--------------------------------------------------------
'use strict';

const { given, when, then } = require('./ServeCommand.gwt');


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
});


test('Can start Express server instance and run indefinitely', () => {

});

test('The server still works if an exception occurs once started', () => {

});

test('Can start silently', () => {

});

test('Can be silent', () => {

});

test('Can start with nodemon', () => {

});

test('Can specify HTTP port to use', () => {

});
