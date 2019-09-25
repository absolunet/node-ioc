//--------------------------------------------------------
//-- Tests - Unit - Translation - Services - Translator
//--------------------------------------------------------
'use strict';

const { given, when, then } = require('./Translator.gwt');



beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
	given.fakeConfigRepository();
	given.translator();
	given.fakeDriver();
});


test('Basic application configuration are used to start the driver', () => {
	when.creatingDriver();
	then.shouldHaveSetConfiguredLocaleOnDriver();
	then.shouldHaveSetConfiguredFallbackLocaleOnDriver();
	then.shouldHaveSetConfiguredTranslationFolderOnDriver();
});

test('Delegates translation to driver', () => {
	when.translating('foo');
	then.driverShouldHaveTranslated('foo');
});

test('Delegates translation for specific locale to driver', () => {
	when.translatingForLocale('fr', 'foo');
	then.shouldHaveSetLocaleOnDriverTwice('fr', 'en');
	then.driverShouldHaveTranslated('foo');
});

test('Delegates adding translation to driver', () => {
	when.addingTranslation('foo', 'bar', 'en');
	then.driverShouldHaveAddedTranslation('foo', 'bar', 'en');
});

test('Delegates adding multiple translations to driver', () => {
	when.addingMultipleTranslations({ foo: 'bar', baz: 'test' }, 'en');
	then.driverShouldHaveAddedTranslation('foo', 'bar', 'en');
	then.driverShouldHaveAddedTranslation('baz', 'test', 'en');
});

test('Delegates using a translation folder to driver', () => {
	when.changingTranslationFolder();
	then.shouldHaveSetConfiguredTranslationFolderOnDriver();
});

test('Getting locale relies on configuration', () => {
	given.localeInConfig('test');
	when.gettingLocale();
	then.resultShouldBe('test');
});

test('Setting locale impacts both the configuration and the driver', () => {
	when.settingLocale('custom');
	when.gettingLocale();
	then.resultShouldBe('custom');
	then.localeInConfigShouldBe('custom');
});

test('Getting fallback locale relies on configuration', () => {
	given.fallbackLocaleInConfig('test');
	when.gettingFallbackLocale();
	then.resultShouldBe('test');
});

test('Setting fallback locale impacts both the configuration and the driver', () => {
	when.settingFallbackLocale('custom');
	when.gettingFallbackLocale();
	then.resultShouldBe('custom');
	then.fallbackLocaleInConfigShouldBe('custom');
});
