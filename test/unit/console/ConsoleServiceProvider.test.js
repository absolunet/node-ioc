//--------------------------------------------------------
//-- Tests - Unit - Console - Console Service Provider
//--------------------------------------------------------
'use strict';

const { given, when, then } = require('./ConsoleServiceProvider.gwt');


beforeEach(() => {
	given.providersAndDependencies();
});


test('Command repository is resolvable', () => {
	when.bootingContainer();
	then.commandRepositoryIsResolvable();
});

test('Command repository is a singleton', () => {
	when.bootingContainer();
	then.commandRepositoryIsSingleton();
});

test('Command registrar service is resolvable', () => {
	when.bootingContainer();
	then.commandRegistrarServiceIsResolvable();
});

test('Command registrar service is a singleton', () => {
	when.bootingContainer();
	then.commandRegistrarServiceIsSingleton();
});

test('Command runner is resolvable', () => {
	when.bootingContainer();
	then.commandRunnerServiceIsResolvable();
});

test('Command runner is a singleton', () => {
	when.bootingContainer();
	then.commandRunnerServiceIsSingleton();
});

test('Terminal service is resolvable', () => {
	when.bootingContainer();
	then.terminalServiceIsResolvable();
});

test('Terminal service is a singleton', () => {
	when.bootingContainer();
	then.terminalServiceIsSingleton();
});

test('Terminal interceptor service is resolvable', () => {
	when.bootingContainer();
	then.terminalInterceptorServiceIsResolvable();
});

test('Terminal interceptor service is a singleton', () => {
	when.bootingContainer();
	then.terminalInterceptorServiceIsSingleton();
});

test('Capture terminal interceptor is resolvable', () => {
	when.bootingContainer();
	then.captureTerminalInterceptorIsResolvable();
});

test('Capture terminal interceptor is a singleton', () => {
	when.bootingContainer();
	then.captureTerminalInterceptorIsSingleton();
});

test('Should set a default command on boot', () => {
	given.fakeCommandRegistrar();
	when.bootingContainer();
	then.shouldHaveRegisteredDefaultCommand();
});
