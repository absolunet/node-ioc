//--------------------------------------------------------
//-- Tests - Unit - Database - Services - Resolver
//--------------------------------------------------------
'use strict';

const { given, when, then } = require('./Resolver.gwt');


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
});


test('Bind paths from configuration on first instantiation', () => {

});

test('Paths have default values if not provided by configuration', () => {

});

test('Can have sopme paths not in config and have default values for them', () => {

});

test('Can resolve all database paths', () => {

});

test('Can resolve a single path by type', () => {

});

test('Paths are properly formatted by using the config grammar', () => {

});
