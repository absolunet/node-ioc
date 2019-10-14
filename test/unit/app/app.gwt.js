//--------------------------------------------------------
//-- Tests - Unit - Application - GWT
//--------------------------------------------------------
'use strict';

const { given, when, then, build } = require('../common.gwt');

let container;


//-- Mocks
//--------------------------------------------------------

const fakeKernel = {
	handle:    jest.fn(),
	terminate: jest.fn()
};

const brokenKernel = {
	handle:    jest.fn(() => { throw new TypeError('An error occurred...'); }),
	terminate: jest.fn()
};

const fakeExceptionHandler = {
	handle: jest.fn()
};


//-- Given
//--------------------------------------------------------

given.freshContainer = () => {
	container = require('../../../src/app'); // eslint-disable-line global-require
	container.bind('kernel.console',    fakeKernel);
	container.bind('exception.handler', fakeExceptionHandler);
};

given.brokenKernel = () => {
	container.bind('kernel.console', brokenKernel);
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

then.shouldHaveCaughtException = () => {
	expect(fakeExceptionHandler.handle).toHaveBeenCalled();
};

then.shouldHaveTerminated = () => {
	expect(fakeKernel.terminate).toHaveBeenCalled();
};


module.exports = build({ given, when, then });
