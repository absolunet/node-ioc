//--------------------------------------------------------
//-- Tests - Unit - Application
//--------------------------------------------------------
'use strict';

const { given, when, then } = require('./app.gwt');


beforeEach(() => {
	jest.resetModules();
	given.freshContainer();
});


test('App boots correctly after a tick', async () => {
	await when.waitingForNextTick();
	then.shouldBeBooted();
	then.shouldHaveHandledWithoutException();
});

test('App boots correctly when booting it manually', () => {
	when.booting();
	then.shouldBeBooted();
	then.shouldNotHaveHandled();
});

test('App contains core services', () => {
	when.booting();
	then.shouldHaveBindings(['config', 'config.grammar', 'env', 'evaluator']);
	then.shouldHaveBindings(['event']);
	then.shouldHaveBindings(['file', 'file.engine']);
	then.shouldHaveBindings(['helper.date', 'helper.file', 'helper.string', 'faker']);
});

test('App handles exception if it occurred during handling process', async () => {
	given.brokenKernel();
	await when.waitingForNextTick();
	then.shouldHaveCaughtException();
});
