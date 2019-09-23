//--------------------------------------------------------
//-- Tests - Unit - Application - GWT
//--------------------------------------------------------
'use strict';

const { given, when, then } = require('../common.gwt');

const container = require('../../../lib/app');


//-- Mocks
//--------------------------------------------------------

const fakeKernel = {
	handle: jest.fn(),
	terminate: jest.fn()
};

const fakeExceptionHandler = {
	handle: jest.fn()
};


//-- Given
//--------------------------------------------------------

given.freshContainer = () => {
	container.flush();
	container.bind('kernel.console', fakeKernel);
	container.bind('exception.handler', fakeExceptionHandler);
};


//-- When
//--------------------------------------------------------

when.booting = () => {
	container.bootIfNotBooted();
};


//-- Then
//--------------------------------------------------------

then.shouldBeBooted = () => {
	expect(container.booted).toBe(true);
};

then.shouldHaveBinding = (abstract) => {
	expect(container.isBound(abstract)).toBe(true);
};

then.shouldHaveBindings = (abstracts) => {
	abstracts.forEach(then.shouldHaveBinding);
};

then.shouldHaveHandledWithoutException = () => {
	expect(fakeKernel.handle).toHaveBeenCalled();
	then.shouldNotHaveCaughtException();
	then.shouldHaveTerminated();
};

then.shouldNotHaveHandled = () => {
	expect(fakeKernel.handle).not.toHaveBeenCalled();
	then.shouldNotHaveCaughtException();
};

then.shouldNotHaveCaughtException = () => {
	expect(fakeExceptionHandler.handle).not.toHaveBeenCalled();
};

then.shouldHaveTerminated = () => {
	expect(fakeKernel.terminate).toHaveBeenCalled();
};


module.exports = { given, when, then };
