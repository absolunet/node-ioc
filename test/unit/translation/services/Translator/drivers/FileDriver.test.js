//--------------------------------------------------------
//-- Tests - Unit - Translation - Services - Translator - Drivers - File Driver
//--------------------------------------------------------

import gwt from './FileDriver.gwt';
const { given, when, then } = gwt;


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
	given.fakeFileManager();
	given.fileDriver();
});


test('Translation without both locale and fallback locale works', () => {
	when.translating('Lorem ipsum');
	then.resultShouldBe('Lorem ipsum');
});

test('Translation without locale but with fallback locale works', () => {
	given.fallbackLocale('en');
	when.translating('Lorem ipsum');
	then.resultShouldBe('Lorem ipsum');
});

test('Translation with locale but without fallback locale works', () => {
	given.locale('en');
	when.translating('Lorem ipsum');
	then.resultShouldBe('Lorem ipsum');
});

test('Translation with both locale and fallback locale works', () => {
	given.locale('en');
	given.fallbackLocale('en');
	when.translating('Lorem ipsum');
	then.resultShouldBe('Lorem ipsum');
});

test('Translation from fallback locale works if locale does not have the translation', async () => {
	given.locale('fr');
	given.fallbackLocale('en');
	given.translation('translations', 'Lorem ipsum', 'dolor sit amet', 'en');
	await when.loadingTranslations();
	when.translating('Lorem ipsum');
	then.resultShouldBe('dolor sit amet');
});

test('Translation from locale works', async () => {
	given.locale('fr');
	given.fallbackLocale('en');
	given.translation('translations', 'Lorem ipsum', 'dolor sit amet', 'en');
	given.translation('translations', 'Lorem ipsum', 'dolor sit amet FR', 'fr');
	await when.loadingTranslations();
	when.translating('Lorem ipsum');
	then.resultShouldBe('dolor sit amet FR');
});

test('Can translate string with one placeholder', async () => {
	given.locale('en');
	given.translation('some', 'translation', 'Some translation {{foo}}', 'en');
	await when.loadingTranslations();
	when.translating('some.translation', { foo: 'bar' });
	then.resultShouldBe('Some translation bar');
});

test('Can translate string with multiple placeholders', async () => {
	given.locale('en');
	given.translation('some', 'translation', 'Some translation {{foo}} {{baz}}', 'en');
	await when.loadingTranslations();
	when.translating('some.translation', { foo: 'bar', baz: 'test' });
	then.resultShouldBe('Some translation bar test');
});

test('Can translate string with one placeholder used multiple times', async () => {
	given.locale('en');
	given.translation('some', 'translation', '{{foo}} some {{foo}} translation {{foo}}', 'en');
	await when.loadingTranslations();
	when.translating('some.translation', { foo: 'bar' });
	then.resultShouldBe('bar some bar translation bar');
});

test('Can add a translation', () => {
	given.locale('en');
	when.addingTranslation('some.translation', 'Some translation', 'en');
	when.translating('some.translation');
	then.resultShouldBe('Some translation');
});

test('Can add a translation for another locale', () => {
	given.locale('en');
	when.addingTranslation('some.translation', 'Une traduction', 'fr');
	when.switchingLocale('fr');
	when.translating('some.translation');
	then.resultShouldBe('Une traduction');
});

test('Can handle pluralization with one possible value with nothing', async () => {
	given.locale('en');
	given.translation('translations', 'key', 'value', 'en');
	await when.loadingTranslations();
	when.translating('key');
	then.resultShouldBe('value');
});

test('Can handle pluralization with one possible value with parameters', async () => {
	given.locale('en');
	given.translation('translations', 'key', 'value', 'en');
	await when.loadingTranslations();
	when.translating('key', {});
	then.resultShouldBe('value');
});

test('Can handle pluralization with one possible value with 0', async () => {
	given.locale('en');
	given.translation('translations', 'key', 'value', 'en');
	await when.loadingTranslations();
	when.translating('key', 0);
	then.resultShouldBe('value');
});

test('Can handle pluralization with one possible value with 1', async () => {
	given.locale('en');
	given.translation('translations', 'key', 'value', 'en');
	await when.loadingTranslations();
	when.translating('key', 1);
	then.resultShouldBe('value');
});

test('Can handle pluralization with one possible value with 2', async () => {
	given.locale('en');
	given.translation('translations', 'key', 'value', 'en');
	await when.loadingTranslations();
	when.translating('key', 2);
	then.resultShouldBe('value');
});

test('Can handle pluralization with one possible value with parameters and 0', async () => {
	given.locale('en');
	given.translation('translations', 'key', 'value', 'en');
	await when.loadingTranslations();
	when.translating('key', {}, 0);
	then.resultShouldBe('value');
});

test('Can handle pluralization with one possible value with parameters and 1', async () => {
	given.locale('en');
	given.translation('translations', 'key', 'value', 'en');
	await when.loadingTranslations();
	when.translating('key', {}, 1);
	then.resultShouldBe('value');
});

test('Can handle pluralization with one possible value with parameters and 2', async () => {
	given.locale('en');
	given.translation('translations', 'key', 'value', 'en');
	await when.loadingTranslations();
	when.translating('key', {}, 2);
	then.resultShouldBe('value');
});

test('Can handle pluralization with two possible values with nothing', async () => {
	given.locale('en');
	given.translation('translations', 'key', ['value', 'values'], 'en');
	await when.loadingTranslations();
	when.translating('key');
	then.resultShouldBe('value');
});

test('Can handle pluralization with two possible values with parameters', async () => {
	given.locale('en');
	given.translation('translations', 'key', ['value', 'values'], 'en');
	await when.loadingTranslations();
	when.translating('key', {});
	then.resultShouldBe('value');
});

test('Can handle pluralization with two possible values with 0', async () => {
	given.locale('en');
	given.translation('translations', 'key', ['value', 'values'], 'en');
	await when.loadingTranslations();
	when.translating('key', 0);
	then.resultShouldBe('value');
});

test('Can handle pluralization with two possible values with 1', async () => {
	given.locale('en');
	given.translation('translations', 'key', ['value', 'values'], 'en');
	await when.loadingTranslations();
	when.translating('key', 1);
	then.resultShouldBe('value');
});

test('Can handle pluralization with two possible values with 2', async () => {
	given.locale('en');
	given.translation('translations', 'key', ['value', 'values'], 'en');
	await when.loadingTranslations();
	when.translating('key', 2);
	then.resultShouldBe('values');
});

test('Can handle pluralization with two possible values with parameters and 0', async () => {
	given.locale('en');
	given.translation('translations', 'key', ['value', 'values'], 'en');
	await when.loadingTranslations();
	when.translating('key', {}, 0);
	then.resultShouldBe('value');
});

test('Can handle pluralization with two possible values with parameters and 1', async () => {
	given.locale('en');
	given.translation('translations', 'key', ['value', 'values'], 'en');
	await when.loadingTranslations();
	when.translating('key', {}, 1);
	then.resultShouldBe('value');
});

test('Can handle pluralization with two possible values with parameters and 2', async () => {
	given.locale('en');
	given.translation('translations', 'key', ['value', 'values'], 'en');
	await when.loadingTranslations();
	when.translating('key', {}, 2);
	then.resultShouldBe('values');
});

test('Can handle pluralization with three possible values with nothing', async () => {
	given.locale('en');
	given.translation('translations', 'key', ['nothing', 'value', 'values'], 'en');
	await when.loadingTranslations();
	when.translating('key');
	then.resultShouldBe('value');
});

test('Can handle pluralization with three possible values with parameters', async () => {
	given.locale('en');
	given.translation('translations', 'key', ['nothing', 'value', 'values'], 'en');
	await when.loadingTranslations();
	when.translating('key', {});
	then.resultShouldBe('value');
});

test('Can handle pluralization with three possible values with 0', async () => {
	given.locale('en');
	given.translation('translations', 'key', ['nothing', 'value', 'values'], 'en');
	await when.loadingTranslations();
	when.translating('key', 0);
	then.resultShouldBe('nothing');
});

test('Can handle pluralization with three possible values with 1', async () => {
	given.locale('en');
	given.translation('translations', 'key', ['nothing', 'value', 'values'], 'en');
	await when.loadingTranslations();
	when.translating('key', 1);
	then.resultShouldBe('value');
});

test('Can handle pluralization with three possible values with 2', async () => {
	given.locale('en');
	given.translation('translations', 'key', ['nothing', 'value', 'values'], 'en');
	await when.loadingTranslations();
	when.translating('key', 2);
	then.resultShouldBe('values');
});

test('Can handle pluralization with three possible values with parameters and 0', async () => {
	given.locale('en');
	given.translation('translations', 'key', ['nothing', 'value', 'values'], 'en');
	await when.loadingTranslations();
	when.translating('key', {}, 0);
	then.resultShouldBe('nothing');
});

test('Can handle pluralization with three possible values with parameters and 1', async () => {
	given.locale('en');
	given.translation('translations', 'key', ['nothing', 'value', 'values'], 'en');
	await when.loadingTranslations();
	when.translating('key', {}, 1);
	then.resultShouldBe('value');
});

test('Can handle pluralization with three possible values with parameters and 2', async () => {
	given.locale('en');
	given.translation('translations', 'key', ['nothing', 'value', 'values'], 'en');
	await when.loadingTranslations();
	when.translating('key', {}, 2);
	then.resultShouldBe('values');
});

test('Can load nested translation files with proper formatting', async () => {
	given.locale('en');
	given.translation('foo/bar', 'baz', 'qux', 'en');
	await when.loadingTranslations();
	when.translating('foo.bar.baz');
	then.resultShouldBe('qux');
});

test('Nested file has priority over global file when nested is loaded first', async () => {
	given.locale('en');
	given.translation('foo/bar', 'baz', 'nested', 'en');
	given.translation('foo', 'bar.baz', 'top-level', 'en');
	await when.loadingTranslations();
	when.translating('foo.bar.baz');
	then.resultShouldBe('nested');
});

test('Nested file has priority over global file when nested is loaded last', async () => {
	given.locale('en');
	given.translation('foo', 'bar.baz', 'top-level', 'en');
	given.translation('foo/bar', 'baz', 'nested', 'en');
	await when.loadingTranslations();
	when.translating('foo.bar.baz');
	then.resultShouldBe('nested');
});
