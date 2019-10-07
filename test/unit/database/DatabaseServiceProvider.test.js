//--------------------------------------------------------
//-- Tests - Unit - Database - Database Service Provider
//--------------------------------------------------------
'use strict';

const { given, when, then } = require('./DatabaseServiceProvider.gwt');


beforeEach(() => {
	given.providersAndDependencies();
});


test('Connection builder is resolvable', () => {

});

test('Connection builder is a singleton', () => {

});

test('Connector service is resolvable', () => {

});

test('Connector service is a singleton', () => {

});

test('Model factory is resolvable', () => {

});

test('Model factory is a singleton', () => {

});

test('Model repository is resolvable', () => {

});

test('Model repository is a singleton', () => {

});

test('ORM is resolvable', () => {

});

test('ORM is a singleton', () => {

});

test('Database path resolver service is resolvable', () => {

});

test('Database path resolver service is a singleton', () => {

});

test('Model repository has a short alias', () => {

});

test('"db" policy passes if the database is enabled in the configuration and the command namespace is truthy', () => {

});

test('"db" policy fails if the database is disabled in the configuration and the command namespace is truthy', () => {

});

test('"db" policy fails if the database is enabled in the configuration and the command namespace is falsy', () => {

});

test('"db" policy fails if the database is disabled in the configuration and the command namespace is falsy', () => {

});

test('The application models are loaded dynamically', () => {

});

test('Does not throw if no models are present in the application', () => {

});
