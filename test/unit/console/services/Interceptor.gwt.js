//--------------------------------------------------------
//-- Tests - Unit - Console - Services - Interceptor - GWT
//--------------------------------------------------------
'use strict';

const { given, when, then, build } = require('../common.gwt');

const container   = require('../../container');
const Interceptor = require('../../../../lib/console/services/Interceptor');

const normalText  = 'Some text';
const coloredText = '\u001B[36mSome text\u001B[0m';

let fakeCapture;
let interceptorService;
let mockedProcessStdoutWrite;
let text;
let result;


//-- Mocks
//--------------------------------------------------------

const fakeCaptureInterceptor = {
	handler: jest.fn((...parameters) => {
		fakeCapture = fakeCapture || [];
		fakeCapture.push(...parameters);
	}),
	flush: jest.fn(() => {
		fakeCapture = fakeCapture || [];
		fakeCapture.splice(0);
	}),
	get capture() { return fakeCapture; }
};

const fakeInterceptor = jest.fn(() => {
	return 'Modified';
});

const otherInterceptor = jest.fn();


//-- Given
//--------------------------------------------------------

given.emptyResult = () => {
	result = undefined;
};

given.fakeCaptureInterceptor = () => {
	container.singleton('terminal.interceptor.capture', fakeCaptureInterceptor);
};

given.mockedProcessStdoutWrite = () => {
	mockedProcessStdoutWrite = jest.spyOn(process.stdout, 'write').mockImplementation();
};

given.interceptorService = () => {
	interceptorService = container.make(Interceptor);
};

given.fakeInterceptor = () => {
	interceptorService.add(fakeInterceptor);
};

given.otherInterceptor = () => {
	interceptorService.add(otherInterceptor);
};

given.otherInterceptorAtIndex = (index) => {
	interceptorService.add(otherInterceptor, index);
};

given.text = () => {
	text = normalText;
};

given.coloredText = () => {
	text = coloredText;
};

given.disabledInterceptors = () => {
	interceptorService.disable();
};

given.editable = () => {
	interceptorService.editable();
};

given.mutedConsole = () => {
	interceptorService.mute();
};

given.removedStyle = () => {
	interceptorService.removeStyle();
};

given.capture = () => {
	interceptorService.startCapture();
};


//-- When
//--------------------------------------------------------

when.logging = () => {
	when.attempting(() => {
		process.stdout.write(text);
	});
};

when.removingInterceptor = () => {
	when.attempting(() => {
		interceptorService.remove(fakeInterceptor);
	});
};

when.removingAllInterceptors = () => {
	when.attempting(() => {
		interceptorService.removeAll();
	});
};

when.disablingInterceptors = () => {
	when.attempting(() => {
		interceptorService.disable();
	});
};

when.enablingInterceptors = () => {
	when.attempting(() => {
		interceptorService.enable();
	});
};

when.mutingConsole = () => {
	when.attempting(() => {
		interceptorService.mute();
	});
};

when.unmutingConsole = () => {
	when.attempting(() => {
		interceptorService.unmute();
	});
};

when.settingEditable = () => {
	when.attempting(() => {
		interceptorService.editable();
	});
};

when.settingUneditable = () => {
	when.attempting(() => {
		interceptorService.uneditable();
	});
};

when.removingStyle = () => {
	when.attempting(() => {
		interceptorService.removeStyle();
	});
};

when.enablingStyle = () => {
	when.attempting(() => {
		interceptorService.keepStyle();
	});
};

when.capturing = () => {
	when.attempting(() => {
		interceptorService.startCapture();
	});
};

when.stopCapturing = () => {
	when.attempting(() => {
		result = interceptorService.stopCapture();
	});
};

when.gettingCapturedData = () => {
	when.attempting(() => {
		result = interceptorService.output;
	});
};


//-- Then
//--------------------------------------------------------

then.resetMockedProcessStdoutWrite = () => {
	mockedProcessStdoutWrite.mockRestore();
};

then.shouldHaveOutputContent = () => {
	then.shouldNotHaveThrown();
	expect(mockedProcessStdoutWrite).toHaveBeenCalledWith(normalText);
};

then.shouldHaveOutputColoredContent = () => {
	then.shouldNotHaveThrown();
	expect(mockedProcessStdoutWrite).toHaveBeenCalledWith(coloredText);
};

then.interceptorShouldHaveIntercepted = () => {
	then.shouldNotHaveThrown();
	expect(fakeInterceptor).toHaveBeenCalledWith(text);
};

then.interceptorShouldHaveInterceptedWithNormalText = () => {
	then.shouldNotHaveThrown();
	expect(fakeInterceptor).toHaveBeenCalledWith(normalText);
};

then.otherInterceptorShouldHaveIntercepted = () => {
	then.shouldNotHaveThrown();
	expect(otherInterceptor).toHaveBeenCalledWith(text);
};

then.otherInterceptorShouldHaveBeenCalledAfterInterceptor = () => {
	then.shouldNotHaveThrown();
	expect(otherInterceptor.mock.invocationCallOrder[0]).toBeGreaterThan(fakeInterceptor.mock.invocationCallOrder[0]);
};

then.otherInterceptorShouldHaveBeenCalledBeforeInterceptor = () => {
	then.shouldNotHaveThrown();
	expect(otherInterceptor.mock.invocationCallOrder[0]).toBeLessThan(fakeInterceptor.mock.invocationCallOrder[0]);
};

then.interceptorShouldNotHaveBeenCalled = () => {
	then.shouldNotHaveThrown();
	expect(fakeInterceptor).not.toHaveBeenCalled();
};

then.otherInterceptorShouldNotHaveBeenCalled = () => {
	then.shouldNotHaveThrown();
	expect(otherInterceptor).not.toHaveBeenCalled();
};

then.shouldNotHaveOutputContent = () => {
	then.shouldNotHaveThrown();
	expect(mockedProcessStdoutWrite).toHaveBeenCalledWith('');
};

then.shouldHaveOutputEditedContent = () => {
	then.shouldNotHaveThrown();
	expect(mockedProcessStdoutWrite).toHaveBeenCalledWith('Modified');
};

then.shouldHaveCaptured = () => {
	then.shouldNotHaveThrown();
	expect(fakeCaptureInterceptor.handler).toHaveBeenCalled();
};

then.interceptorShouldHaveInterceptedTwice = () => {
	then.shouldNotHaveThrown();
	expect(fakeInterceptor).toHaveBeenCalledTimes(2);
};

then.shouldHaveCapturedOnce = () => {
	then.shouldNotHaveThrown();
	expect(fakeCaptureInterceptor.handler).toHaveBeenCalledTimes(1);
};

then.shouldHaveReceivedCapturedOnce = () => {
	then.shouldNotHaveThrown();
	expect(result).toStrictEqual([text]);
};


module.exports = build({ given, when, then });
