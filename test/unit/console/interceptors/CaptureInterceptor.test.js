//--------------------------------------------------------
//-- Tests - Unit - Console - Services - Capture Interceptor
//--------------------------------------------------------
'use strict';

const { given, when, then } = require('./CaptureInterceptor.gwt');


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
	given.captureInterceptor();
});


test('Can capture single output', () => {
	given.line();
	when.logging();
	then.shouldHaveInterceptedLine();
});

test('Can capture multiple output', () => {
	given.line();
	given.otherLine();
	when.logging();
	then.shouldHaveInterceptedLineAndOtherLine();
});

test('Can capture colored output', () => {
	given.coloredLine();
	when.logging();
	then.shouldHaveInterceptedColoredLine();
});

test('Can reset captured data to empty', () => {
	given.line();
	when.logging();
	when.resettingCapture();
	then.shouldHaveNoCapture();
});

test('Captured output is read-only', () => {
	given.line();
	when.logging();
	when.modifyingResult();
	then.resultShouldNotEqualCapture();
});
