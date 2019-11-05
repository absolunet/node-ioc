//--------------------------------------------------------
//-- Tests - Unit - Foundation - Exceptions - Handler drivers - Ouch Driver
//--------------------------------------------------------

import gwt from './OuchDriver.gwt';
const { given, when, then } = gwt;


beforeEach(() => {
	given.bootedContainer();
	given.mockedOuch();
	given.fakeException();
	given.fakeRequest();
	given.fakeResponse();
	given.fakeConfigRepository();
	given.ouchDriver();
});


test('Can render exception as HTML', async () => {
	await when.renderingException();
	then.shouldHaveRenderedHtmlException();
});

test('Can render exception as JSON if accepts JSON', async () => {
	given.acceptApplicationJsonHeader();
	await when.renderingException();
	then.shouldHaveRenderedJsonExceptionWithStackTrace();
});

test('Can render exception as JSON if requested over XHR', async () => {
	given.xRequestedWitXmlHttpRequesthHeader();
	await when.renderingException();
	then.shouldHaveRenderedJsonExceptionWithStackTrace();
});

test('Can render non-verbose exception as JSON if requested over XHR and not in debug mode', async () => {
	given.xRequestedWitXmlHttpRequesthHeader();
	given.noDebugInConfiguration();
	await when.renderingException();
	then.shouldHaveRenderedJsonExceptionWithOnly(['type', 'message']);
});
