//--------------------------------------------------------
//-- Tests - Unit - Database - Seeder
//--------------------------------------------------------
'use strict';

const { given, when, then } = require('./Seeder.gwt');


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
});


test('Can get singleton instance from class', () => {

});

test('Can call seed method from class to the singleton with the given connection', () => {

});

test('Static call to the seed method results by an async call by default', () => {

});
