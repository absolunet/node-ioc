//--------------------------------------------------------
//-- Tests - Unit - Database - Services - Builder
//--------------------------------------------------------
'use strict';

const { given, when, then } = require('./Builder.gwt');


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
});


test('Can get default connection', () => {

});

test('Can get connection by name', () => {

});

test('Can get connection without name and receive default connection', () => {

});

test('Throws if the connection does not exists in configuration', () => {

});

test('Throws if the driver was not specified in the connection configuration', () => {

});

test('Throws if the driver does not exists', () => {

});

test('Can get driver for given connection', () => {

});

test('Can get driver for default connection if name is not provided', () => {

});
