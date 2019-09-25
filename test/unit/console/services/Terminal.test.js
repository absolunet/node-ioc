//--------------------------------------------------------
//-- Tests - Unit - Console - Services - Terminal
//--------------------------------------------------------
'use strict';

const { given, when, then } = require('./Terminal.gwt');


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
});


test('Can get argv based on process', () => {

});

test('Can get command as string', () => {

});

test('Can get command arguments, assuming that current command does not contains space', () => {

});

test('Can get inquirer instance', () => {

});

test('Can ask question', () => {

});

test('Can ask question with default answer', () => {

});

test('Can ask question and expect the same answer twice', () => {

});

test('Can ask a question with secret answer', () => {

});

test('Can ask a question with secret answer and expect the same answer twice', () => {

});

test('Can ask for confirmation', () => {

});

test('Can ask a question with choices of answer', () => {

});

test('Can ask a question with choices of answer with a default answer', () => {

});

test('Can print a table with header and data as arrays', () => {

});

test('Can get the table as string without printing it', () => {

});

test('Can print multiple tables one under the other', () => {

});

test('Can print multiple tables side by side', () => {

});

test('Can get multiple tables one under the other as string', () => {

});

test('Can get multiple tables side by side as string', () => {

});
