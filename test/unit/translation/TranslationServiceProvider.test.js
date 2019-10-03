//--------------------------------------------------------
//-- Tests - Unit - Translation - Translation Service Provider
//--------------------------------------------------------
'use strict';

const { given, when, then } = require('./TranslationServiceProvider.gwt');


beforeEach(() => {
	given.providersAndDependencies();
	given.emptyResult();
});


test('Translator service is resolvable', () => {
	when.bootingContainer();
	then.translatorServiceIsResolvable();
});

test('Translator service is a singleton', () => {
	when.bootingContainer();
	then.translatorServiceIsSingleton();
});


test('Translation folder path is bound', () => {
	when.bootingContainer();
	then.langPathIsResolvable();
});

test('Translation folder path can be resolved with container method', () => {
	given.bootedContainer();
	when.callingLangPathMethodOnContainer();
	then.resultShouldBeLangPath();
});
