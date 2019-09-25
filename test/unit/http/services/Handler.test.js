//--------------------------------------------------------
//-- Tests - Unit - HTTP - Services - Handler
//--------------------------------------------------------
'use strict';

const { given, when, then } = require('./Handler.gwt');


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
});


test('Can handle request with route action as closure', () => {

});

test('Can handle request with route action as controller action', () => {

});

test('Can handle exception with broken route action as closure', () => {

});

test('Can handle exception with broken route action as controller action', () => {

});

test('Exception is handled if request times out within closure', () => {

});

test('Exception is handled if request times out within controller action', () => {

});
