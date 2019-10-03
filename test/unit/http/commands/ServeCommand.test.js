//--------------------------------------------------------
//-- Tests - Unit - HTTP - Commands - Serve Command
//--------------------------------------------------------
'use strict';

const { given, when, then } = require('./ServeCommand.gwt');


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
	given.noArgument();
	given.fakeTerminal();
	given.mockedNodemon();
	given.fakeServer();
	given.fakeRouter();
	given.commandRunner();
	given.serveCommand();
});


test('Can start server instance and run indefinitely', async () => {
	await when.runningCommand();
	then.serverShouldHaveStarted();
	then.shouldHaveOutputPort();
});

test('Can start server instance and output route result', async () => {
	await when.runningCommand();
	await when.runningFakeRequest();
	then.shouldHaveOutputPort();
	then.shouldHaveOutputRouteResult();
});

test('Can start silently', async () => {
	given.startSilentFlag();
	await when.runningCommand();
	then.serverShouldHaveStarted();
	then.shouldNotHaveOutput();
});

test('Can start silently but still output routes', async () => {
	given.startSilentFlag();
	await when.runningCommand();
	await when.runningFakeRequest();
	then.shouldHaveOutputRouteResult();
});

test('Can be silent', async () => {
	given.silentFlag();
	await when.runningCommand();
	await when.runningFakeRequest();
	then.shouldNotHaveOutput();
});

test('Can start with daemon', async () => {
	given.daemonFlag();
	await when.runningCommand();
	then.nodemonShouldHaveStartedCommandWithStartSilentFlag();
});

test('Can silently start with daemon', async () => {
	given.daemonFlag();
	given.silentFlag();
	await when.runningCommand();
	then.nodemonShouldHaveStartedCommandWithStartSilentFlag();
	then.nodemonShouldHaveStartedCommandWithSilentFlag();
});

test('Can specify HTTP port to use', async () => {
	given.customPortOption();
	await when.runningCommand();
	then.serverShouldUseCustomPort();
	then.shouldHaveOutputCustomPort();
});

test('Can start with daemon on custom HTTP port', async () => {
	given.daemonFlag();
	given.customPortOption();
	await when.runningCommand();
	then.shouldHaveOutputCustomPort();
	then.nodemonShouldHaveStartedCommandWithStartSilentFlag();
	then.nodemonShouldHaveStartedCommandWithCustomPort();
});
