//--------------------------------------------------------
//-- Tests - Unit - Database - Migration
//--------------------------------------------------------
'use strict';

const { given, when, then } = require('./Migration.gwt');


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
});


test('Can get singleton instance from class', () => {

});

test('Can call up method from class to the singleton with the given connection', () => {

});

test('Static call to the up method results by an async call by default', () => {

});

test('Can call down method from class to the singleton with the given connection', () => {

});

test('Static call to the down method results by an async call by default', () => {

});
