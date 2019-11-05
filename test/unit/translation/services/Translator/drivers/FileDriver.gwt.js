//--------------------------------------------------------
//-- Tests - Unit - Translation - Services - Translator - Drivers - File Driver - GWT
//--------------------------------------------------------

import gwt from '../../../common.gwt';
const { given, when, then, build } = gwt;

import container  from '../../../../container';
import FileDriver from '../../../../../../dist/node/translation/services/Translator/drivers/FileDriver';

let driver;
let result;
let fakeTranslations;


//-- Mocks
//--------------------------------------------------------

const fakeFileManager = {
	exists: jest.fn(() => { return true; }),
	loadRecursivelyInFolder: jest.fn(() => { return fakeTranslations; })
};


//-- Given
//--------------------------------------------------------

given.fileDriver = () => {
	driver = container.make(FileDriver, { app: container });
};

given.fakeFileManager = () => {
	container.bind('file', fakeFileManager);
	fakeTranslations = {};
};

given.locale = (locale) => {
	driver.setLocale(locale);
};

given.fallbackLocale = (locale) => {
	driver.setFallbackLocale(locale);
};

given.translation = (file, key, value, locale) => {
	fakeTranslations[file]              = fakeTranslations[file] || {};
	fakeTranslations[file][key]         = fakeTranslations[file][key] || {};
	fakeTranslations[file][key][locale] = value;
};

given.translationFolder = (folder) => {
	container.configurePaths({ lang: folder });
};

given.emptyResult = () => {
	result = undefined;
};


//-- When
//--------------------------------------------------------

when.loadingTranslations = async () => {
	await when.attemptingAsync(async () => {
		await driver.loadTranslations();
	});
};

when.translating = (...parameters) => {
	when.attempting(() => {
		result = driver.translate(...parameters);
	});
};

when.addingTranslation = (...parameters) => {
	when.attempting(() => {
		driver.addTranslation(...parameters);
	});
};

when.switchingLocale = (locale) => {
	driver.setLocale(locale);
};


//-- Then
//--------------------------------------------------------

then.resultShouldBe = (expected) => {
	then.shouldNotHaveThrown();
	expect(result).toBe(expected);
};

then.shouldHaveLoadedFilesInFolder = (folder) => {
	then.shouldNotHaveThrown();
	expect(fakeFileManager.loadRecursivelyInFolder).toHaveBeenCalledWith(folder);
};

then.shouldHaveSearchedInTranslationFile = () => {
	then.shouldNotHaveThrown();
};


export default build({ given, when, then });
