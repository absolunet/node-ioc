//--------------------------------------------------------
//-- Tests - Unit - Translation - Services - Translator - GWT
//--------------------------------------------------------
'use strict';

const { given, when, then, build } = require('../../common.gwt');


const container = require('../../../container');
const Translator = require('../../../../../dist/node/translation/services/Translator');


let translator;
let result;
let fakeTranslations;
let fakeConfig;


//-- Mocks
//--------------------------------------------------------

const fakeDriver = {
	translate: jest.fn((key) => {
		return fakeTranslations[key] ? fakeTranslations[key].value : key;
	}),
	addTranslation: jest.fn((key, value, locale = container.make('config').get('locale')) => {
		fakeTranslations[key] = { value, locale };

		return fakeDriver;
	}),
	useTranslationFolder: jest.fn(() => { return fakeDriver; }),
	setLocale: jest.fn(() => { return fakeDriver; }),
	setFallbackLocale: jest.fn(() => { return fakeDriver; })
};

const fakeConfigRepository = {
	get: jest.fn((key, defaultValue) => {
		return fakeConfig[key] || defaultValue;
	}),
	set: jest.fn((key, value) => {
		fakeConfig[key] = value;

		return fakeConfigRepository;
	})
};


//-- Given
//--------------------------------------------------------

given.translator = () => {
	translator = container.make(Translator, { app: container });
};

given.fakeConfigRepository = () => {
	container.bind('config', fakeConfigRepository);
	fakeConfig = {};
	given.localeInConfig('en');
	given.fallbackLocaleInConfig('en');
};

given.localeInConfig = (locale) => {
	container.make('config').set('app.locale', locale);
};

given.fallbackLocaleInConfig = (locale) => {
	container.make('config').set('app.fallback_locale', locale);
};

given.emptyResult = () => {
	result = undefined;
};

given.fakeDriver = () => {
	translator.addDriver('fake', fakeDriver);
	translator.setDefaultDriver('fake');
	fakeTranslations = {};
};


//-- When
//--------------------------------------------------------

when.callingOnTranslator = (method, parameters = []) => {
	when.attempting(() => {
		result = translator[method](...parameters);
	});
};
when.creatingDriver = () => {
	when.callingOnTranslator('driver');
};

when.translating = (...parameters) => {
	when.callingOnTranslator('translate', parameters);
};

when.translatingForLocale = (...parameters) => {
	when.callingOnTranslator('translateForLocale', parameters);
};

when.addingTranslation = (...parameters) => {
	when.callingOnTranslator('addTranslation', parameters);
};

when.addingMultipleTranslations = (...parameters) => {
	when.callingOnTranslator('addTranslations', parameters);
};

when.changingTranslationFolder = (parameters) => {
	when.callingOnTranslator('useTranslationFolder', parameters);
};

when.gettingLocale = () => {
	result = translator.locale;
};

when.settingLocale = (...parameters) => {
	when.callingOnTranslator('setLocale', parameters);
};

when.gettingFallbackLocale = () => {
	result = translator.fallbackLocale;
};

when.settingFallbackLocale = (...parameters) => {
	when.callingOnTranslator('setFallbackLocale', parameters);
};


//-- Then
//--------------------------------------------------------

then.resultShouldBe = (expected) => {
	then.shouldNotHaveThrown();
	expect(result).toBe(expected);
};

then.shouldHaveCalledDriverMethodWith = (method, parameters) => {
	then.shouldNotHaveThrown();
	expect(fakeDriver[method]).toHaveBeenCalled();
	expect(fakeDriver[method]).toHaveBeenCalledWith(...parameters);
};

then.shouldHaveSetConfiguredLocaleOnDriver = () => {
	then.shouldHaveCalledDriverMethodWith('setLocale', [container.make('config').get('app.locale')]);
};

then.shouldHaveSetConfiguredFallbackLocaleOnDriver = () => {
	then.shouldHaveCalledDriverMethodWith('setFallbackLocale', [container.make('config').get('app.fallback_locale')]);
};

then.shouldHaveSetConfiguredTranslationFolderOnDriver = () => {
	then.shouldHaveCalledDriverMethodWith('useTranslationFolder', [container.langPath()]);
};

then.driverShouldHaveTranslated = (key) => {
	then.shouldHaveCalledDriverMethodWith('translate', [key, {}, 1]);
};

then.shouldHaveSetLocaleOnDriverTwice = (first, second) => {
	then.shouldNotHaveThrown();
	const { length: count } = fakeDriver.setLocale.mock.calls;
	expect(fakeDriver.setLocale).toHaveBeenNthCalledWith(count - 1, first);
	expect(fakeDriver.setLocale).toHaveBeenNthCalledWith(count,     second);
};

then.driverShouldHaveAddedTranslation = (key, value, locale) => {
	then.shouldNotHaveThrown();
	expect(fakeDriver.addTranslation).toHaveBeenCalled();
	expect(fakeTranslations).toMatchObject({ [key]: { value, locale } });
};

then.configShouldHave = (key, value) => {
	then.shouldNotHaveThrown();
	expect(container.make('config').get(key)).toBe(value);
};

then.localeInConfigShouldBe = (locale) => {
	then.configShouldHave('app.locale', locale);
};

then.fallbackLocaleInConfigShouldBe = (locale) => {
	then.configShouldHave('app.fallback_locale', locale);
};


module.exports = build({ given, when, then });
