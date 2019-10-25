//--------------------------------------------------------
//-- Tests - Unit - Foundation - Exceptions - Handler drivers - View Driver
//--------------------------------------------------------

import gwt from './ViewDriver.gwt';
const { given, when, then } = gwt;


beforeEach(() => {
	given.bootedContainer();
	given.exception();
	given.fakeRequest();
	given.fakeResponse();
	given.viewDriver();
});


test('Can render text if view factory and view resolver do not exist', async () => {
	await when.renderingException();
	then.shouldHaveRenderedDefaultText();
});

test('Can render text if view factory does not exist', async () => {
	given.fakeViewResolver();
	await when.renderingException();
	then.shouldHaveRenderedDefaultText();
});

test('Can render text if view resolver does not exist', async () => {
	given.fakeViewFactory();
	await when.renderingException();
	then.shouldHaveRenderedDefaultText();
});

test('Can render text if either custom and generic view do not exist', async () => {
	given.fakeViewFactory();
	given.fakeViewResolver();
	await when.renderingException();
	then.shouldHaveRenderedDefaultText();
});

test('Can render translated text if view factory and view resolver do not exist', async () => {
	given.fakeTranslator();
	await when.renderingException();
	then.shouldHaveRenderedTranslatedText();
});

test('Can render translated text if view factory does not exist', async () => {
	given.fakeTranslator();
	given.fakeViewResolver();
	await when.renderingException();
	then.shouldHaveRenderedTranslatedText();
});

test('Can render translated text if view resolver does not exist', async () => {
	given.fakeTranslator();
	given.fakeViewFactory();
	await when.renderingException();
	then.shouldHaveRenderedTranslatedText();
});

test('Can render translated text if either custom and generic view do not exist', async () => {
	given.fakeTranslator();
	given.fakeViewFactory();
	given.fakeViewResolver();
	await when.renderingException();
	then.shouldHaveRenderedTranslatedText();
});

test('Can render generic view if view factory and view resolver exist with anonymous exception', async () => {
	given.fakeViewFactory();
	given.fakeViewResolver();
	given.genericView();
	await when.renderingException();
	then.shouldHaveRenderedGenericView();
});

test('Can render generic view if view factory and view resolver exist with 404 exception when 404 view does not exists', async () => {
	given.notFoundException();
	given.fakeViewFactory();
	given.fakeViewResolver();
	given.genericView();
	await when.renderingException();
	then.shouldHaveRenderedGenericView();
});

test('Can render 404 view if view factory and view resolver exist with 404 exception when 404 view exists', async () => {
	given.notFoundException();
	given.fakeViewFactory();
	given.fakeViewResolver();
	given.genericView();
	given.notFoundView();
	await when.renderingException();
	then.shouldHaveRenderedNotFoundView();
});
