//--------------------------------------------------------
//-- Tests - Unit - Console - Interceptors - Capture Interceptor - GWT
//--------------------------------------------------------
'use strict';

const { given, when, then, build } = require('../common.gwt');

const container          = require('../../container');
const CaptureInterceptor = require('../../../../dist/node/console/interceptors/CaptureInterceptor');

let captureInterceptor;
let result;
let lines;


given.captureInterceptor = () => {
	captureInterceptor = container.make(CaptureInterceptor);
	lines = [];
};

given.lineToLog = (content) => {
	lines.push(content);
};

given.line = () => {
	given.lineToLog('Some log');
};

given.otherLine = () => {
	given.lineToLog('Some other log');
};

given.coloredLine = () => {
	given.lineToLog(`\u001B[36mSome colored log\u001B[0m`);
};


when.logging = () => {
	when.attempting(() => {
		lines.forEach((line) => {
			captureInterceptor.handler(line);
		});
		({ capture: result } = captureInterceptor);
	});
};

when.resettingCapture = () => {
	when.attempting(() => {
		captureInterceptor.flush();
	});
};

when.modifyingResult = () => {
	when.attempting(() => {
		result.push('This is something added');
	});
};


then.shouldHaveNoCapture = () => {
	then.shouldNotHaveThrown();
	expect(captureInterceptor.capture.length).toBe(0);
};

then.resultShouldContain = (line) => {
	then.shouldNotHaveThrown();
	expect(result.includes(line)).toBe(true);
};

then.shouldHaveInterceptedLine = () => {
	then.resultShouldContain('Some log');
};

then.shouldHaveInterceptedOtherLine = () => {
	then.resultShouldContain('Some other log');
};

then.shouldHaveInterceptedLineAndOtherLine = () => {
	then.shouldHaveInterceptedLine();
	then.shouldHaveInterceptedOtherLine();
	expect(result.length).toBe(2);
};

then.shouldHaveInterceptedColoredLine = () => {
	then.resultShouldContain(`\u001B[36mSome colored log\u001B[0m`);
};

then.resultShouldNotEqualCapture = () => {
	then.shouldNotHaveThrown();
	expect(result).not.toEqual(captureInterceptor.capture);
};

module.exports = build({ given, when, then });
