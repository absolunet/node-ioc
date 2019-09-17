//--------------------------------------------------------
//-- Tests - Unit - Translation
//--------------------------------------------------------
'use strict';

const path                       = require('path');
const container                  = require('../common');
const TranslationServiceProvider = require('../../../lib/translation/TranslationServiceProvider');
const FileDriver                 = require('../../../lib/translation/services/Translator/drivers/FileDriver');


describe('Node IoC - Translation', () => {


	beforeEach(() => {
		container.register(TranslationServiceProvider);
		container.bootIfNotBooted();
	});

	describe('Base', () => {

		test('Translator is resolvable', () => {
			expect(container.isBound('translator')).toBe(true);
			expect(container.make('translator')).toBeTruthy();
		});

		test('Translation folder path is bound', () => {
			expect(container.isBound('path.lang')).toBe(true);
			expect(container.make('path.lang')).toBeTruthy();
			expect(typeof container.make('path.lang')).toBe('string');
			expect(typeof container.langPath).toBe('function');
			expect(container.langPath()).toBe(container.make('path.lang'));
		});

	});

	describe('Translator', () => {

		let translator;

		let driver;

		beforeEach(() => {
			container.make('config').set('app.locale', 'some_locale');
			container.make('config').set('app.fallback_locale', 'some_fallback_locale');
			translator = container.make('translator');
			driver = {
				boot: jest.fn(),
				translate: jest.fn(),
				addTranslation: jest.fn(),
				useTranslationFolder: jest.fn(),
				setLocale: jest.fn(),
				setFallbackLocale: jest.fn()
			};
			translator.addDriver('test', driver);
			translator.setDefaultDriver('test');
		});

		test('Basic application configuration are used to start the driver', () => {
			expect(translator.driver()).toBe(driver);
			expect(driver.setLocale).toHaveBeenCalled();
			expect(driver.setLocale).toHaveBeenCalledWith('some_locale');
			expect(driver.setFallbackLocale).toHaveBeenCalled();
			expect(driver.setFallbackLocale).toHaveBeenCalledWith('some_fallback_locale');
			expect(driver.useTranslationFolder).toHaveBeenCalled();
			expect(driver.useTranslationFolder).toHaveBeenCalledWith(container.make('path.lang'));
		});

		test('Delegates translation to driver', () => {
			translator.translate('foo');
			expect(driver.translate).toHaveBeenCalled();
			expect(driver.translate).toHaveBeenCalledWith('foo', {}, 1);
		});

		test('Delegates translation for specific locale to driver', () => {
			translator.driver();
			const setLocalePreviousCallsLength = driver.setLocale.mock.calls.length;
			translator.translateForLocale('en', 'foo');
			expect(driver.translate).toHaveBeenCalled();
			expect(driver.translate).toHaveBeenCalledWith('foo', {}, 1);
			expect(driver.setLocale).toHaveBeenCalledTimes(2 + setLocalePreviousCallsLength);
		});

		test('Delegates adding translation to driver', () => {
			translator.addTranslation('foo', 'bar', 'en');
			expect(driver.addTranslation).toHaveBeenCalled();
			expect(driver.addTranslation).toHaveBeenCalledWith('foo', 'bar', 'en');
		});

		test('Delegates adding multiple translations to driver', () => {
			translator.addTranslations({ foo: 'bar', baz: 'test' }, 'en');
			expect(driver.addTranslation).toHaveBeenCalledTimes(2);
			expect(driver.addTranslation.mock.calls).toEqual([['foo', 'bar', 'en'], ['baz', 'test', 'en']]);
		});

		test('Delegates using a translation folder to driver', () => {
			translator.useTranslationFolder('/foo/bar');
			expect(driver.useTranslationFolder).toHaveBeenCalled();
			expect(driver.useTranslationFolder).toHaveBeenCalledWith('/foo/bar');
		});

		test('Getting locale relies on configuration', () => {
			container.make('config').set('app.locale', 'fr');
			expect(translator.locale).toBe('fr');
			container.make('config').set('app.locale', 'en');
			expect(translator.locale).toBe('en');
		});

		test('Setting locale impacts both the configuration and the driver', () => {
			container.make('config').set('app.locale', 'fr');
			translator.setLocale('en');
			expect(container.make('config').get('app.locale')).toBe('en');
		});

		test('Getting fallback locale relies on configuration', () => {
			container.make('config').set('app.fallback_locale', 'fr');
			expect(translator.fallbackLocale).toBe('fr');
			container.make('config').set('app.fallback_locale', 'en');
			expect(translator.fallbackLocale).toBe('en');
		});

		test('Setting fallback locale impacts both the configuration and the driver', () => {
			container.make('config').set('app.fallback_locale', 'fr');
			translator.setFallbackLocale('en');
			expect(container.make('config').get('app.fallback_locale')).toBe('en');
		});

	});

	describe('Drivers', () => {

		let driver;

		describe('File driver', () => {

			beforeEach(() => {
				driver = container.make(FileDriver);
			});

			test('Translation without both locale and fallback locale works', () => {
				expect(() => {
					driver.translate('Lorem ipsum');
				}).not.toThrow();
				expect(driver.translate('Lorem ipsum')).toBe('Lorem ipsum');
			});

			test('Translation without locale but with fallback locale works', () => {
				driver.setFallbackLocale('en');
				expect(() => {
					driver.translate('Lorem ipsum');
				}).not.toThrow();
				expect(driver.translate('Lorem ipsum')).toBe('Lorem ipsum');
			});

			test('Translation with locale but without fallback locale works', () => {
				driver.setLocale('en');
				expect(() => {
					driver.translate('Lorem ipsum');
				}).not.toThrow();
				expect(driver.translate('Lorem ipsum')).toBe('Lorem ipsum');
			});

			test('Translation with both locale and fallback locale works', () => {
				driver.setLocale('en');
				driver.setFallbackLocale('en');
				expect(() => {
					driver.translate('Lorem ipsum');
				}).not.toThrow();
				expect(driver.translate('Lorem ipsum')).toBe('Lorem ipsum');
			});

			test('Translation from fallback locale works if locale does not have the translation', () => {
				driver.setLocale('fr');
				driver.setFallbackLocale('en');
				driver.addTranslation('Some translation', 'Une traduction', 'fr');
				driver.addTranslation('Lorem ipsum', 'dolor sit amet', 'en');
				expect(driver.translate('Some translation')).toBe('Une traduction');
				expect(driver.translate('Lorem ipsum')).toBe('dolor sit amet');
			});

			test('Can translate string with one placeholder', () => {
				driver.setLocale('en');
				driver.addTranslation('some.translation', 'Some translation {{foo}}', 'en');
				expect(driver.translate('some.translation', { foo: 'bar' })).toBe('Some translation bar');
			});

			test('Can translate string with multiple placeholders', () => {
				driver.setLocale('en');
				driver.addTranslation('some.translation', 'Some translation {{foo}} {{baz}}', 'en');
				expect(driver.translate('some.translation', { foo: 'bar', baz: 'test' })).toBe('Some translation bar test');
			});

			test('Can translate string with one placeholder used multiple times', () => {
				driver.setLocale('en');
				driver.addTranslation('some.translation', '{{foo}} Some {{foo}} translation {{foo}}', 'en');
				expect(driver.translate('some.translation', { foo: 'bar' })).toBe('bar Some bar translation bar');
			});

			test('Can add a translation', () => {
				driver.setLocale('en');
				const originalTranslation = driver.translate('foo');
				driver.addTranslation('foo', 'bar');
				const newTranslation = driver.translate('foo');

				expect(originalTranslation).toBe('foo');
				expect(newTranslation).toBe('bar');
			});

			test('Can add a translation for another locale', () => {
				driver.setLocale('en');
				const originalTranslation = driver.translate('foo');
				driver.addTranslation('foo', 'bar', 'fr');
				const newTranslation = driver.translate('foo');

				driver.setLocale('fr');

				expect(originalTranslation).toBe('foo');
				expect(newTranslation).toBe('foo');
				expect(driver.translate('foo')).toBe('bar');
			});

			test('Can handle pluralization', () => {
				driver.setLocale('en');
				driver.addTranslation('foo', 'bar');
				driver.addTranslation('plural', ['one', 'many']);
				driver.addTranslation('multiple', ['none', 'one', 'many']);

				expect(driver.translate('foo')).toBe('bar');
				expect(driver.translate('plural')).toBe('one');
				expect(driver.translate('multiple')).toBe('one');

				expect(driver.translate('foo', 1)).toBe('bar');
				expect(driver.translate('plural', 1)).toBe('one');
				expect(driver.translate('multiple', 1)).toBe('one');

				expect(driver.translate('foo', {}, 1)).toBe('bar');
				expect(driver.translate('plural', {}, 1)).toBe('one');
				expect(driver.translate('multiple', {}, 1)).toBe('one');

				expect(driver.translate('foo', 2)).toBe('bar');
				expect(driver.translate('plural', 2)).toBe('many');
				expect(driver.translate('multiple', 2)).toBe('many');

				expect(driver.translate('foo', {}, 2)).toBe('bar');
				expect(driver.translate('plural', {}, 2)).toBe('many');
				expect(driver.translate('multiple', {}, 2)).toBe('many');

				expect(driver.translate('foo', 0)).toBe('bar');
				expect(driver.translate('plural', 0)).toBe('one');
				expect(driver.translate('multiple', 0)).toBe('none');

				expect(driver.translate('foo', {}, 0)).toBe('bar');
				expect(driver.translate('plural', {}, 0)).toBe('one');
				expect(driver.translate('multiple', {}, 0)).toBe('none');
			});

			test('Can change the translation folder', () => {
				driver.setLocale('en');

				const originalTranslation = driver.translate('foo.lorem.ipsum');
				driver.useTranslationFolder(path.join(__dirname, 'stubs', 'lang'));
				const englishTranslation = driver.translate('foo.lorem.ipsum');

				driver.setLocale('fr');

				const frenchTranslation = driver.translate('foo.lorem.ipsum');

				expect(originalTranslation).toBe('foo.lorem.ipsum');
				expect(englishTranslation).toBe('Lorem ipsum in english');
				expect(frenchTranslation).toBe('Lorem ipsum en français');
			});

			test('Can use the translation files with placeholders', () => {
				driver.setLocale('en');
				driver.useTranslationFolder(path.join(__dirname, 'stubs', 'lang'));
				expect(driver.translate('bar.some_key')).toBe('Some value with {{token}}');
				expect(driver.translate('bar.some_key', { token: 'foo' })).toBe('Some value with foo');
			});

			test('Can use the translation files with pluralization', () => {
				driver.setLocale('en');
				driver.useTranslationFolder(path.join(__dirname, 'stubs', 'lang'));

				expect(driver.translate('bar.some_none_single_or_plural')).toBe('One');
				expect(driver.translate('bar.some_none_single_or_plural', {})).toBe('One');
				expect(driver.translate('bar.some_none_single_or_plural', 1)).toBe('One');
				expect(driver.translate('bar.some_none_single_or_plural', {}, 1)).toBe('One');
				expect(driver.translate('bar.some_none_single_or_plural', 0)).toBe('Nope...');
				expect(driver.translate('bar.some_none_single_or_plural', {}, 0)).toBe('Nope...');
				expect(driver.translate('bar.some_none_single_or_plural', 2)).toBe('Many');
				expect(driver.translate('bar.some_none_single_or_plural', {}, 2)).toBe('Many');

				driver.setLocale('fr');


				expect(driver.translate('bar.some_none_single_or_plural')).toBe('Un');
				expect(driver.translate('bar.some_none_single_or_plural', {})).toBe('Un');
				expect(driver.translate('bar.some_none_single_or_plural', 1)).toBe('Un');
				expect(driver.translate('bar.some_none_single_or_plural', {}, 1)).toBe('Un');
				expect(driver.translate('bar.some_none_single_or_plural', 0)).toBe('Non...');
				expect(driver.translate('bar.some_none_single_or_plural', {}, 0)).toBe('Non...');
				expect(driver.translate('bar.some_none_single_or_plural', 2)).toBe('Plusieurs');
				expect(driver.translate('bar.some_none_single_or_plural', {}, 2)).toBe('Plusieurs');
			});

			test('Can translate from a generic file without namespace', () => {
				driver.setLocale('en');
				driver.useTranslationFolder(path.join(__dirname, 'stubs', 'lang'));

				expect(driver.translate('Hello world')).toBe('Hello world');

				driver.setLocale('fr');
				expect(driver.translate('Hello world')).toBe('Bonjour le monde');
			});
		});

	});

});
