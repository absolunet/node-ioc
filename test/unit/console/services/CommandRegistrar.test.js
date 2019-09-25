//--------------------------------------------------------
//-- Tests - Unit - Console - Services - Command Registrar
//--------------------------------------------------------
'use strict';

const { given, when, then } = require('./CommandRegistrar.gwt');


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
});


test('Can add a command and forward it to the command repository', () => {

});

test('Can add all commands in a given folder and forward them to the command repository', () => {

});

test('Does not add any command and does not throw if the given folder is empty', () => {

});

test('Set a default command to be executed if no command has been provided when running the application', () => {

});

test('Can get the default command instance', () => {

});

test('Can resolve the command by name and run it', () => {

});

test('Can resolve current command and run it', () => {

});

test('Can resolve the command by name and run it only if policies allow it', () => {

});

test('Can resolve the command by name and run it regardless of the policies', () => {

});

test('Can bootstrap a yargs instance without running it', () => {

});

test('Can bootstrap a yargs instance with only allowed commands without running it', () => {

});
