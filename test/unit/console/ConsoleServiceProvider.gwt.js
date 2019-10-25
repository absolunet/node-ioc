//--------------------------------------------------------
//-- Tests - Unit - Console - Console Service Provider - GWT
//--------------------------------------------------------

import gwt from './common.gwt';
const { given, when, then, build } = gwt;

import container from '../container';


//-- Mocks
//--------------------------------------------------------

const fakeCommandRegistrar = {
	setDefault: jest.fn()
};


//-- Given
//--------------------------------------------------------

given.fakeCommandRegistrar = () => {
	container.decorate('command.registrar', () => {
		return fakeCommandRegistrar;
	});
};


//-- Then
//--------------------------------------------------------

then.commandRepositoryIsResolvable = () => {
	then.serviceShouldBeResolvable('command');
};

then.commandRepositoryIsSingleton = () => {
	then.shouldHaveSingleton('command');
};

then.commandRegistrarServiceIsResolvable = () => {
	then.serviceShouldBeResolvable('command.registrar');
};

then.commandRegistrarServiceIsSingleton = () => {
	then.shouldHaveSingleton('command.registrar');
};

then.commandRunnerServiceIsResolvable = () => {
	then.serviceShouldBeResolvable('command.runner');
};

then.commandRunnerServiceIsSingleton = () => {
	then.shouldHaveSingleton('command.runner');
};

then.terminalServiceIsResolvable = () => {
	then.serviceShouldBeResolvable('terminal');
};

then.terminalServiceIsSingleton = () => {
	then.shouldHaveSingleton('terminal');
};

then.terminalInterceptorServiceIsResolvable = () => {
	then.serviceShouldBeResolvable('terminal.interceptor');
};

then.terminalInterceptorServiceIsSingleton = () => {
	then.shouldHaveSingleton('terminal.interceptor');
};

then.captureTerminalInterceptorIsResolvable = () => {
	then.serviceShouldBeResolvable('terminal.interceptor.capture');
};

then.captureTerminalInterceptorIsSingleton = () => {
	then.shouldHaveSingleton('terminal.interceptor.capture');
};

then.shouldHaveRegisteredDefaultCommand = () => {
	then.shouldNotHaveThrown();
	expect(fakeCommandRegistrar.setDefault).toHaveBeenCalledTimes(1);
};


export default build({ given, when, then });
