//--------------------------------------------------------
//-- Tests - Unit - Database - Services - Connector - Drivers - SQLite Driver
//--------------------------------------------------------
'use strict';

const { given, when, then } = require('./SqliteDriver.gwt');


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
});


test('Specified a valid Knex client', () => {

});

test('Can set connection by name', () => {

});

test('Can set default connection', () => {

});

test('Can check if connection exists by name', () => {

});

test('Can get new connection with connection config', () => {

});

test('Can create connection with connection config and save it', () => {

});

test('Can get existing connection if exists', () => {

});

test('Can get new connection if does not exists', () => {

});

test('Can create Knex configuration based on given configuration, current client, resolver and configured migrations table', () => {

});
