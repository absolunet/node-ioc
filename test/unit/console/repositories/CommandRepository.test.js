//--------------------------------------------------------
//-- Tests - Unit - Console - Repositories - Command Repository
//--------------------------------------------------------
'use strict';

const { given, when, then } = require('./CommandRepository.gwt');


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
	given.commandRepository();
	given.emptyResult();
});


test('Can get all registered commands', () => {

});

test('Can get all registered commands that pass policies', () => {

});

test('Can get all registered commands as groups', () => {

});

test('Can get all registered command that pass policies as groups', () => {

});

test('Can get single command instance by command name', () => {

});

test('Does not throw if no command exist when getting by name', () => {

});

test('Can check if command exists by name', () => {

});

test('Can check if command does not exist by name', () => {

});

test('Can add a command as constructor', () => {

});

test('Can add a command as concrete', () => {

});
