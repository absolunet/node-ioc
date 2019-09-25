//--------------------------------------------------------
//-- Tests - Unit - Console - Services - Command Runner
//--------------------------------------------------------
'use strict';

const { given, when, then } = require('./CommandRunner.gwt');


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
});


test('Can run a command', () => {

});

test('Can run a command with arguments', () => {

});

test('Can run a command with custom yargs instance', () => {

});

test('Can run a command that throws and forward the error handling to the exception handler', () => {

});

test('Can run a command unsafely', () => {

});

test('Can run a command that throws unsafely and throws the error', () => {

});

test('Can run a command preprocess method', () => {

});

test('Can run a command handle method', () => {

});

test('Can forward the call if forward is given in the command', () => {

});

test('Can run a command postprocess method', () => {

});
