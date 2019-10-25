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
	given.ouchDriver();
});


test('Can render exception as HTML', async () => {
	await when.renderingException();
	then.shouldHaveRenderedHtmlException();
});

test('Can render exception as JSON if accepts JSON', async () => {
	given.acceptApplicationJsonHeader();
	await when.renderingException();
	then.shouldHaveRenderedJsonException();
});

test('Can render exception as JSON if requested over XHR', async () => {
	given.xRequestedWitXmlHttpRequesthHeader();
	await when.renderingException();
	then.shouldHaveRenderedJsonException();
});
