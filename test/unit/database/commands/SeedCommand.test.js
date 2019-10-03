//--------------------------------------------------------
//-- Tests - Unit - Database - Commands - Seed Command
//--------------------------------------------------------
'use strict';

const { given, when, then } = require('./SeedCommand.gwt');


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
});


test('Can seed database with default connection', () => {

});

test('Can seed database with specified connection', () => {

});

test('Uses database prefix', () => {

});
