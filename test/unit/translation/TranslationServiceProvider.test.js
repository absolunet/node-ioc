//--------------------------------------------------------
//-- Tests - Unit - Translation - Translation Service Provider
//--------------------------------------------------------

import gwt from './TranslationServiceProvider.gwt';
const { given, when, then } = gwt;


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
