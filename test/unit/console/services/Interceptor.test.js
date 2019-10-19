//--------------------------------------------------------
//-- Tests - Unit - Console - Services - Interceptor
//--------------------------------------------------------

import gwt from './Interceptor.gwt';
const { given, when, then } = gwt;


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
	given.emptyResult();
	given.fakeCaptureInterceptor();
	given.mockedProcessStdoutWrite();
	given.interceptorService();
	given.fakeInterceptor();
});

afterEach(() => {
	then.resetMockedProcessStdoutWrite();
});


test('Can add an interceptor', () => {
	given.otherInterceptor();
	given.text();
	when.logging();
	then.interceptorShouldHaveIntercepted();
	then.otherInterceptorShouldHaveIntercepted();
	then.otherInterceptorShouldHaveBeenCalledAfterInterceptor();
	then.shouldHaveOutputContent();
});

test('Can add an interceptor at a given index', () => {
	given.otherInterceptorAtIndex(0);
	given.text();
	when.logging();
	then.interceptorShouldHaveIntercepted();
	then.otherInterceptorShouldHaveIntercepted();
	then.otherInterceptorShouldHaveBeenCalledBeforeInterceptor();
	then.shouldHaveOutputContent();
});

test('Can remove an interceptor', () => {
	given.otherInterceptor();
	given.text();
	when.removingInterceptor();
	when.logging();
	then.interceptorShouldNotHaveBeenCalled();
	then.otherInterceptorShouldHaveIntercepted();
	then.shouldHaveOutputContent();
});

test('Can remove all interceptors', () => {
	given.otherInterceptor();
	given.text();
	when.removingAllInterceptors();
	when.logging();
	then.interceptorShouldNotHaveBeenCalled();
	then.otherInterceptorShouldNotHaveBeenCalled();
	then.shouldHaveOutputContent();
});

test('Can disable interceptors', () => {
	given.text();
	when.disablingInterceptors();
	when.logging();
	then.interceptorShouldNotHaveBeenCalled();
	then.shouldHaveOutputContent();
});

test('Can enable interceptors once disabled', () => {
	given.text();
	given.disabledInterceptors();
	when.enablingInterceptors();
	when.logging();
	then.interceptorShouldHaveIntercepted();
	then.shouldHaveOutputContent();
});

test('Can mute console output', () => {
	given.text();
	when.mutingConsole();
	when.logging();
	then.interceptorShouldHaveIntercepted();
	then.shouldNotHaveOutputContent();
});

test('Can unmute console output once muted', () => {
	given.text();
	given.mutedConsole();
	when.unmutingConsole();
	when.logging();
	then.interceptorShouldHaveIntercepted();
	then.shouldHaveOutputContent();
});

test('Can allow interceptors to modify the output of the logged data', () => {
	given.text();
	when.settingEditable();
	when.logging();
	then.interceptorShouldHaveIntercepted();
	then.shouldHaveOutputEditedContent();
});

test('Can prevent interceptors from modifying the output of the logged data', () => {
	given.text();
	given.editable();
	when.settingUneditable();
	when.logging();
	then.interceptorShouldHaveIntercepted();
	then.shouldHaveOutputContent();
});

test('Can remove output styles such as color from chalk', () => {
	given.coloredText();
	when.removingStyle();
	when.logging();
	then.interceptorShouldHaveInterceptedWithNormalText();
	then.shouldHaveOutputColoredContent();
});

test('Can keep output styles once removed', () => {
	given.coloredText();
	given.removedStyle();
	when.enablingStyle();
	when.logging();
	then.interceptorShouldHaveIntercepted();
	then.shouldHaveOutputColoredContent();
});

test('Can initialize capture interceptor', () => {
	given.text();
	when.capturing();
	when.logging();
	then.interceptorShouldHaveIntercepted();
	then.shouldHaveCaptured();
});

test('Can stop capture interceptor and get the captured data at the same time', () => {
	given.text();
	given.capture();
	when.logging();
	when.stopCapturing();
	when.logging();
	then.interceptorShouldHaveInterceptedTwice();
	then.shouldHaveCapturedOnce();
	then.shouldHaveReceivedCapturedOnce();
});

test('Can get captured data at any time', () => {
	given.text();
	given.capture();
	when.logging();
	when.gettingCapturedData();
	then.shouldHaveReceivedCapturedOnce();
});
