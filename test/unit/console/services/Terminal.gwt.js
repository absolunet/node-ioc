//--------------------------------------------------------
//-- Tests - Unit - Console - Services - Terminal - GWT
//--------------------------------------------------------
'use strict';

const { given, when, then, build } = require('../common.gwt');

const inquirer     = require('inquirer');
const container    = require('../../container');
const Terminal     = require('../../../../dist/node/console/services/Terminal');
const originalArgv = process.argv;

let mockedPrompt;
let mockedPrint;
let result;
let terminal;
let fakePromptResult;


//-- Mocks
//--------------------------------------------------------


//-- Given
//--------------------------------------------------------

given.emptyResult = () => {
	result = undefined;
};

given.terminal = () => {
	terminal = container.make(Terminal);
};

given.fakeProcessArgv = () => {
	process.argv = ['/path/to/node', 'ioc', 'foo:bar', 'parameter', '--option=value', '--flag'];
};

given.fakePromptResult = (value) => {
	fakePromptResult = value;
};

given.mockInquirerPrompt = () => {
	mockedPrompt = jest.spyOn(inquirer, 'prompt').mockImplementation(() => {
		return Promise.resolve(fakePromptResult || {});
	});
};

given.fakePrintOnTerminal = () => {
	mockedPrint = jest.spyOn(terminal, 'print').mockImplementation();
};


//-- When
//--------------------------------------------------------

when.getting = (property) => {
	when.attempting(() => {
		result = terminal[property];
	});
};

when.calling = (method, parameters = []) => {
	when.attempting(() => {
		result = terminal[method](...parameters);
	});
};

when.callingWithoutResult = (method, parameters = []) => {
	when.attempting(() => {
		terminal[method](...parameters);
	});
};

when.callingAsync = async (method, parameters = []) => {
	await when.attemptingAsync(async () => {
		result = await terminal[method](...parameters);
	});
};

when.gettingArgv = () => {
	when.getting('argv');
};

when.gettingCommand = () => {
	when.getting('command');
};

when.gettingArgs = () => { // eslint-disable-line unicorn/prevent-abbreviations
	when.getting('args');
};

when.gettingInquirer = () => {
	when.getting('inquirer');
};

when.askingQuestion = async () => {
	await when.callingAsync('ask', ['Name']);
};

when.askingQuestionWithDefaultAnswer = async () => {
	await when.callingAsync('ask', ['Name', 'John Smith']);
};

when.askingSecret = async () => {
	await when.callingAsync('secret', ['Password']);
};

when.confirming = async () => {
	await when.callingAsync('confirm', ['Are you sure?']);
};

when.askingWithChoicesAsArray = async () => {
	await when.callingAsync('choice', ['Choose between', ['Foo', 'Bar']]);
};

when.askingWithChoicesAsObject = async () => {
	await when.callingAsync('choice', ['Choose between', { foo: 'Foo', bar: 'Bar' }]);
};

when.askingWithChoicesWithDefaultAnswer = async () => {
	await when.callingAsync('choice', ['Choose between', { foo: 'Foo', bar: 'Bar' }, 'Foo']);
};

when.printingTable = () => {
	when.callingWithoutResult('table', [['First name', 'Last name'], [['John', 'Smith'], ['Foo', 'Bar'], ['Baz', 'Qux']]]);
};

when.gettingTable = () => {
	when.calling('table', [['First name', 'Last name'], [['John', 'Smith'], ['Foo', 'Bar'], ['Baz', 'Qux']], {}, false]);
};

when.printingTables = () => {
	when.callingWithoutResult('tables', [[[['Key', 'Value'], ['Other key', 'Other value']], [['Key', 'Foo'], ['Other key', 'Bar']]]]);
};

when.printingTablesSideBySide = () => {
	when.callingWithoutResult('tables', [[[['Key', 'Value'], ['Other key', 'Other value']], [['Key', 'Foo'], ['Other key', 'Bar']]], true]);
};

when.gettingTables = () => {
	when.calling('tables', [[[['Key', 'Value'], ['Other key', 'Other value']], [['Key', 'Foo'], ['Other key', 'Bar']]], false, {}, false]);
};

when.gettingTablesSideBySide = () => {
	when.calling('tables', [[[['Key', 'Value'], ['Other key', 'Other value']], [['Key', 'Foo'], ['Other key', 'Bar']]], true, {}, false]);
};


//-- Then
//--------------------------------------------------------

then.resetProcessArgv = () => {
	process.argv = originalArgv;
};

then.resetInquirerPromptMock = () => {
	mockedPrompt.mockRestore();
};

then.resetPrintMock = () => {
	mockedPrint.mockRestore();
};

then.resultShouldBe = (expected) => {
	then.shouldNotHaveThrown();
	expect(result).toBe(expected);
};

then.resultShouldEqual = (expected) => {
	then.shouldNotHaveThrown();
	expect(result).toStrictEqual(expected);
};

then.resultShouldBeProcessArgvArguments = () => {
	then.resultShouldEqual(['foo:bar', 'parameter', '--option=value', '--flag']);
};

then.resultShouldBeCurrentCommand = () => {
	then.resultShouldBe('foo:bar parameter --option=value --flag');
};

then.resultShouldBeCurrentCommandArguments = () => {
	then.resultShouldEqual('parameter --option=value --flag');
};

then.resultShouldBeInquirerModule = () => {
	then.resultShouldBe(inquirer);
};

then.shouldHaveCalledPromptOnInquirer = () => {
	then.shouldNotHaveThrown();
	expect(mockedPrompt).toHaveBeenCalledWith({
		'message': 'Name',
		'name':    'answer',
		'type':    'input',
		'default': null
	});
};

then.shouldHaveCalledPromptOnInquirerWithDefaultAnswer = () => {
	then.shouldNotHaveThrown();
	expect(mockedPrompt).toHaveBeenCalledWith({
		'message': 'Name',
		'name':    'answer',
		'type':    'input',
		'default': 'John Smith'
	});
};

then.shouldHaveCalledPromptOnInquirerWithTypePassword = () => {
	then.shouldNotHaveThrown();
	expect(mockedPrompt).toHaveBeenCalledWith({
		'message': 'Password',
		'name':    'answer',
		'type':    'password',
		'default': null
	});
};

then.shouldHaveCalledPromptOnInquirerWithDefaultAnswerAsFalse = () => {
	then.shouldNotHaveThrown();
	expect(mockedPrompt).toHaveBeenCalledWith({
		'message': 'Are you sure?',
		'name':    'answer',
		'type':    'confirm',
		'default': false
	});
};

then.shouldHaveCalledPromptOnInquirerWithChoices = () => {
	then.shouldNotHaveThrown();
	expect(mockedPrompt).toHaveBeenCalledWith({
		'message': 'Choose between',
		'name':    'answer',
		'choices': ['Foo', 'Bar'],
		'type':    'list',
		'default': ''
	});
};

then.shouldHaveCalledPromptOnInquirerWithChoicesWithDefaultAnswer = () => {
	then.shouldNotHaveThrown();
	expect(mockedPrompt).toHaveBeenCalledWith({
		'message': 'Choose between',
		'name':    'answer',
		'choices': ['Foo', 'Bar'],
		'type':    'list',
		'default': 'Foo'
	});
};

then.shouldNotHavePrinted = () => {
	then.shouldNotHaveThrown();
	expect(mockedPrint).not.toHaveBeenCalled();
};

then.tableShouldHaveBeenPrinted = () => {
	then.shouldNotHaveThrown();
	expect(mockedPrint).toHaveBeenCalled();
	expect(mockedPrint.mock.calls[0][0].split('\n')).toStrictEqual([
		'╔════════════╤═══════════╗',
		'║ First name │ Last name ║',
		'╟────────────┼───────────╢',
		'╟────────────┼───────────╢',
		'║ John       │ Smith     ║',
		'╟────────────┼───────────╢',
		'║ Foo        │ Bar       ║',
		'╟────────────┼───────────╢',
		'║ Baz        │ Qux       ║',
		'╚════════════╧═══════════╝',
		''
	]);
};

then.shouldHaveReceivedTableAsString = () => {
	then.shouldNotHaveThrown();
	expect(result.split('\n')).toStrictEqual([
		'╔════════════╤═══════════╗',
		'║ First name │ Last name ║',
		'╟────────────┼───────────╢',
		'╟────────────┼───────────╢',
		'║ John       │ Smith     ║',
		'╟────────────┼───────────╢',
		'║ Foo        │ Bar       ║',
		'╟────────────┼───────────╢',
		'║ Baz        │ Qux       ║',
		'╚════════════╧═══════════╝',
		''
	]);
};

then.tablesShouldHaveBeenPrintedOneUnderTheOther = () => {
	then.shouldNotHaveThrown();
	expect(mockedPrint.mock.calls[0][0].split('\n')).toStrictEqual([
		'╔═══════════╤═════════════╗',
		'║ Key       │ Value       ║',
		'╟───────────┼─────────────╢',
		'║ Other key │ Other value ║',
		'╚═══════════╧═════════════╝',
		'',
		'╔═══════════╤═════╗',
		'║ Key       │ Foo ║',
		'╟───────────┼─────╢',
		'║ Other key │ Bar ║',
		'╚═══════════╧═════╝',
		''
	]);
};

then.tablesShouldHaveBeenPrintedSideBySide = () => {
	then.shouldNotHaveThrown();
	expect(mockedPrint.mock.calls[0][0].split('\n')).toStrictEqual([
		'╔═══════════╤═════════════╗	╔═══════════╤═════╗',
		'║ Key       │ Value       ║	║ Key       │ Foo ║',
		'╟───────────┼─────────────╢	╟───────────┼─────╢',
		'║ Other key │ Other value ║	║ Other key │ Bar ║',
		'╚═══════════╧═════════════╝	╚═══════════╧═════╝',
		''
	]);
};

then.shouldHaveReceivedTableOneUnderTheOtherAsString = () => {
	then.shouldNotHaveThrown();
	expect(result.split('\n')).toStrictEqual([
		'╔═══════════╤═════════════╗',
		'║ Key       │ Value       ║',
		'╟───────────┼─────────────╢',
		'║ Other key │ Other value ║',
		'╚═══════════╧═════════════╝',
		'',
		'╔═══════════╤═════╗',
		'║ Key       │ Foo ║',
		'╟───────────┼─────╢',
		'║ Other key │ Bar ║',
		'╚═══════════╧═════╝',
		''
	]);
};

then.shouldHaveReceivedTableSideBySideAsString = () => {
	then.shouldNotHaveThrown();
	expect(result.split('\n')).toStrictEqual([
		'╔═══════════╤═════════════╗	╔═══════════╤═════╗',
		'║ Key       │ Value       ║	║ Key       │ Foo ║',
		'╟───────────┼─────────────╢	╟───────────┼─────╢',
		'║ Other key │ Other value ║	║ Other key │ Bar ║',
		'╚═══════════╧═════════════╝	╚═══════════╧═════╝',
		''
	]);
};


module.exports = build({ given, when, then });
