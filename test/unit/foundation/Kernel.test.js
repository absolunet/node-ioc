//--------------------------------------------------------
//-- Tests - Unit - Foundation - Kernel
//--------------------------------------------------------
'use strict';

const { given, when, then } = require('./Kernel.gwt');


test('Register all development providers into the application after booting', () => {
	given.emptyKernel();
	when.makingKernel();
	then.coreProvidersShouldHaveBeenRegistered();
	then.coreDevelopmentProvidersShouldNotHaveBeenRegistered();
});

test('Register all core providers into the application on initialization', () => {
	given.emptyKernel();
	when.makingKernel();
	when.bootingContainer();
	then.coreDevelopmentProvidersShouldHaveBeenRegistered();
});

test('Does not register development providers if the application environment is "production"', () => {
	given.emptyKernel();
	given.productionEnvironment();
	when.makingKernel();
	when.bootingContainer();
	then.coreProvidersShouldHaveBeenRegistered();
	then.coreDevelopmentProvidersShouldNotHaveBeenRegistered();
});

test('Handle method is abstract and must be implemented', () => {
	given.kernel();
	when.handling();
	then.shouldHaveThrownNotImplementedError();
});

test('Terminate method is not required to be implemented', () => {
	given.kernel();
	when.terminating();
	then.shouldNotHaveThrown();
});

