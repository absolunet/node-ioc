//--------------------------------------------------------
//-- Tests - Unit - Application - Main
//--------------------------------------------------------
'use strict';

const { given, when, then } = require('./main.gwt');


beforeEach(() => {
	given.emptyResult();
});


test('Framework exposes application', () => {
	given.mainFile();
	when.gettingApplication();
	then.shouldHaveReceivedApplicationInstance();
});

test('Framework does not start application', () => {
	given.mockedSetTimeout();
	when.loadingMainFile();
	then.mockedSetTimeoutCallbackShouldNotHaveBeenCalled();
	then.restoreMockedSetTimeout();
});

test('All framework accessible classes are working', () => {
	given.mainFile();
	when.gettingAllKeysExceptApplicationAndMixins();
	then.allKeysShouldBeConstructor();
});

test('All exposed mixins are class factories', () => {
	given.mainFile();
	when.gettingMixinsWithoutFactory();
	then.allKeysShouldFactoryConstructor();
});
