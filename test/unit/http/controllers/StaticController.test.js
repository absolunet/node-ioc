//--------------------------------------------------------
//-- Tests - Unit - HTTP - Controllers - Static Controller
//--------------------------------------------------------
'use strict';

const { given, when, then } = require('./StaticController.gwt');


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
});


test('Sends file response based on given folder and received file from request parameters', () => {

});

test('Send a not found response if file does not exists', () => {

});
