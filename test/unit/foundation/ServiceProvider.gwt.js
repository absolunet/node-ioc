//--------------------------------------------------------
//-- Tests - Unit - Foundation - Service Provider - GWT
//--------------------------------------------------------

import gwt from './common.gwt';
const { given, when, then, build } = gwt;

import * as path       from 'path';
import slash           from 'slash';
import container       from '../container';
import Command         from '../../../dist/node/console/Command';
import ServiceProvider from '../../../dist/node/foundation/ServiceProvider';

const FooServiceProvider = class FooServiceProvider extends ServiceProvider {};
const BarServiceProvider = class BarServiceProvider extends ServiceProvider {};

let result;
let serviceProvider;
let otherServiceProvider;
let commands;
let fakeFiles;


//-- Mocks
//--------------------------------------------------------

const fakeCommandRepository = {
	add: jest.fn()
};

const FakeCommand      = class extends Command {};
const OtherFakeCommand = class extends Command {};

const fakeConfigRepository = {
	loadConfigFromFolder: jest.fn()
};

const fakeFileManager = {
	loadRecursivelyInFolder: jest.fn((folder) => {
		return fakeFiles[folder];
	}),
	scandir: jest.fn((folder) => {
		return Object.keys(fakeFiles).filter((fakeFile) => {
			return fakeFile.startsWith(folder);
		});
	})
};

const fakeTranslator = {
	addTranslations: jest.fn()
};

const fakeViewResolver = {
	addPath:   jest.fn(),
	namespace: jest.fn()
};

const fakeDatabaseResolver = {
	bindPaths: jest.fn(() => {
		container.bind('path.migration',     '/path/to/dist/node/migrations');
		container.bind('path.src.migration', '/path/to/src/migrations');
	})
};

const fakeMoment = {
	format: jest.fn(() => {
		return '12345678901234';
	})
};

const fakeDateHelper = jest.fn(() => {
	return fakeMoment;
});

const fakePathHelper = {
	relative: jest.fn((from, to) => {
		return slash(path.relative(from, to));
	})
};


//-- Given
//--------------------------------------------------------

given.emptyResult = () => {
	result = undefined;
};

given.fakeCommandRepository = () => {
	container.singleton('command', fakeCommandRepository);
};

given.fakeDatabaseResolver = () => {
	container.singleton('db.resolver', fakeDatabaseResolver);
};

given.fakeDateHelper = () => {
	container.singleton('helper.date', () => { return fakeDateHelper; });
};

given.fakePathHelper = () => {
	container.singleton('helper.path', fakePathHelper);
};

given.fakeConfigRepository = () => {
	container.singleton('config', fakeConfigRepository);
};

given.fakeTranslator = () => {
	container.singleton('translator', fakeTranslator);
};

given.fakeFileManager = () => {
	container.singleton('file', fakeFileManager);
	fakeFiles = {};
};

given.fakeViewResolver = () => {
	container.singleton('view.resolver', fakeViewResolver);
};

given.provider = () => {
	serviceProvider = container.make(FooServiceProvider, { app: container });
};

given.otherProvider = () => {
	otherServiceProvider = container.make(BarServiceProvider, { app: container });
};

given.fakeCommands = () => {
	commands = [FakeCommand, OtherFakeCommand];
};

given.fakeTranslationsFile = () => {
	fakeFiles['/path/to/translations'] = { file: { key: { en: 'translation value' } } };
};

given.publishedConfig = () => {
	serviceProvider.publishConfig('/path/to/config/file.yaml');
};

given.publishedConfigByOtherProvider = () => {
	otherServiceProvider.publishConfig('/path/to/config/file.yaml');
};

given.publishedViews = () => {
	serviceProvider.publishViews('/path/to/views');
};

given.stubMigration = () => {
	fakeFiles['/path/to/migrations/09876543210987_CreateSomeTable.stub'] = 'export default {};';
};

given.javaScriptMigration = () => {
	fakeFiles['/path/to/migrations/09876543210987_CreateSomeTable.js'] = 'export default {};';
};


//-- When
//--------------------------------------------------------

when.loadingCommands = () => {
	when.attempting(() => {
		serviceProvider.loadCommands(commands);
	});
};

when.loadingConfig = () => {
	when.attempting(() => {
		serviceProvider.loadConfig('/path/to/config');
	});
};

when.loadingTranslations = () => {
	when.attempting(() => {
		serviceProvider.loadTranslations('/path/to/translations');
	});
};

when.loadingViews = () => {
	when.attempting(() => {
		serviceProvider.loadViews('/path/to/views');
	});
};

when.loadingViewsWithNamespace = () => {
	when.attempting(() => {
		serviceProvider.loadViews('/path/to/views', 'foo');
	});
};

when.publishingFile = () => {
	when.attempting(() => {
		serviceProvider.publish({ '/path/to/folder/file.yaml': container.basePath('file.yaml') });
	});
};

when.publishingFolder = () => {
	when.attempting(() => {
		serviceProvider.publish({ '/path/to/folder': container.basePath() });
	});
};

when.publishingFileWithTag = () => {
	when.attempting(() => {
		serviceProvider.publish({ '/path/to/folder/file.yaml': container.basePath('file.yaml') }, 'foo');
	});
};

when.publishingAssets = () => {
	when.attempting(() => {
		serviceProvider.publishAssets('/path/to/assets');
	});
};

when.publishingOtherAssets = () => {
	when.attempting(() => {
		serviceProvider.publishAssets('/path/to/other/assets');
	});
};

when.publishingConfig = () => {
	when.attempting(() => {
		serviceProvider.publishConfig('/path/to/config');
	});
};

when.publishingOtherConfig = () => {
	when.attempting(() => {
		serviceProvider.publishConfig('/path/to/other/config');
	});
};

when.publishingMigration = () => {
	when.attempting(() => {
		serviceProvider.publishMigrations('/path/to/migrations');
	});
};

when.publishingTranslations = () => {
	when.attempting(() => {
		serviceProvider.publishTranslations('/path/to/translations');
	});
};

when.publishingOtherTranslations = () => {
	when.attempting(() => {
		serviceProvider.publishTranslations('/path/to/other/translations');
	});
};

when.publishingViews = () => {
	when.attempting(() => {
		serviceProvider.publishViews('/path/to/views');
	});
};

when.publishingViewsInFolder = () => {
	when.attempting(() => {
		serviceProvider.publishViews('/path/to/views', 'foo');
	});
};

when.publishingOtherViews = () => {
	when.attempting(() => {
		serviceProvider.publishViews('/path/to/other/views');
	});
};

when.loadingAndPublishingConfig = () => {
	when.attempting(() => {
		serviceProvider.loadAndPublishConfig('/path/to/config');
	});
};

when.loadingAndPublishingTranslations = () => {
	when.attempting(() => {
		serviceProvider.loadAndPublishTranslations('/path/to/translations');
	});
};

when.loadingAndPublishingViews = () => {
	when.attempting(() => {
		serviceProvider.loadAndPublishViews('/path/to/views');
	});
};

when.loadingAndPublishingViewsWithNamespace = () => {
	when.attempting(() => {
		serviceProvider.loadAndPublishViews('/path/to/views', 'foo');
	});
};

when.gettingPublishableProviders = () => {
	when.attempting(() => {
		result = ServiceProvider.publishableProviders();
	});
};

when.gettingPublishableTags = () => {
	when.attempting(() => {
		result = ServiceProvider.publishableTags();
	});
};

when.flushingApplication = () => {
	when.attempting(() => {
		container.flush();
	});
};


//-- Then
//--------------------------------------------------------

then.resultShouldEqual = (expected) => {
	then.shouldNotHaveThrown();
	expect(result).toStrictEqual(expected);
};

then.commandShouldHaveBeenLoaded = () => {
	then.shouldNotHaveThrown();
	expect(fakeCommandRepository.add).toHaveBeenCalledTimes(commands.length);
	const hasLoadedAllCommands = fakeCommandRepository.add.mock.calls.every(([command]) => {
		return commands.includes(command);
	});
	expect(hasLoadedAllCommands).toBe(true);
};

then.configShouldHaveBeenLoaded = () => {
	then.shouldNotHaveThrown();
	expect(fakeConfigRepository.loadConfigFromFolder).toHaveBeenCalledWith('/path/to/config');
};

then.translationsShouldHaveBeenLoaded = () => {
	then.shouldNotHaveThrown();
	expect(fakeFileManager.loadRecursivelyInFolder).toHaveBeenCalledWith('/path/to/translations');
	expect(fakeTranslator.addTranslations).toHaveBeenCalledWith({ file: { key: { en: 'translation value' } } });
};

then.viewsShouldHaveBeenLoaded = () => {
	then.shouldNotHaveThrown();
	expect(fakeViewResolver.addPath).toHaveBeenCalledWith('/path/to/views');
};

then.viewsShouldHaveBeenLoadedWithNamespace = () => {
	then.shouldNotHaveThrown();
	expect(fakeViewResolver.namespace).toHaveBeenCalledWith('foo', '/path/to/views');
};

then.shouldHaveAddedFileToBePublished = () => {
	then.shouldNotHaveThrown();
	expect(ServiceProvider.getAllPublishable()).toMatchObject({
		'/path/to/folder/file.yaml': container.basePath('file.yaml')
	});
};

then.shouldHaveAddedFolderToBePublished = () => {
	then.shouldNotHaveThrown();
	expect(ServiceProvider.getAllPublishable()).toMatchObject({
		'/path/to/folder': container.basePath()
	});
};

then.shouldHaveAddedTagToPublishedFile = () => {
	then.shouldHaveAddedFileToBePublished();
	expect(ServiceProvider.publishableTags().includes('foo')).toBe(true);
	expect(ServiceProvider.getPublishableByTag('foo')).toMatchObject({
		'/path/to/folder/file.yaml': container.basePath('file.yaml')
	});
};

then.assetsShouldBePublishable = () => {
	expect(ServiceProvider.getAllPublishable()).toMatchObject({
		'/path/to/assets': container.publicPath()
	});
};

then.otherAssetsShouldBePublishable = () => {
	expect(ServiceProvider.getAllPublishable()).toMatchObject({
		'/path/to/other/assets': container.publicPath()
	});
};

then.configShouldBePublishable = () => {
	expect(ServiceProvider.getAllPublishable()).toMatchObject({
		'/path/to/config': container.configPath()
	});
};

then.migrationShouldBePublishable = () => {
	expect(ServiceProvider.getAllPublishable()).toMatchObject({
		'/path/to/migrations/09876543210987_CreateSomeTable.stub': '/path/to/src/migrations/12345678901234_CreateSomeTable.js'
	});
};

then.migrationShouldNotBePublishable = () => {
	expect(ServiceProvider.getAllPublishable()).not.toMatchObject({
		'/path/to/migrations/09876543210987_CreateSomeTable.stub': '/path/to/src/migrations/12345678901234_CreateSomeTable.js'
	});
	expect(ServiceProvider.getAllPublishable()).not.toMatchObject({
		'/path/to/migrations/09876543210987_CreateSomeTable.js': '/path/to/src/migrations/12345678901234_CreateSomeTable.js'
	});
};

then.otherConfigShouldBePublishable = () => {
	expect(ServiceProvider.getAllPublishable()).toMatchObject({
		'/path/to/other/config': container.configPath()
	});
};

then.translationsShouldBePublishable = () => {
	expect(ServiceProvider.getAllPublishable()).toMatchObject({
		'/path/to/translations': container.langPath()
	});
};

then.otherTranslationsShouldBePublishable = () => {
	expect(ServiceProvider.getAllPublishable()).toMatchObject({
		'/path/to/other/translations': container.langPath()
	});
};

then.viewsShouldBePublishable = () => {
	expect(ServiceProvider.getAllPublishable()).toMatchObject({
		'/path/to/views': container.viewPath()
	});
};

then.viewsShouldBePublishableInFolder = () => {
	expect(ServiceProvider.getAllPublishable()).toMatchObject({
		'/path/to/views': container.viewPath('foo')
	});
};

then.otherViewsShouldBePublishable = () => {
	expect(ServiceProvider.getAllPublishable()).toMatchObject({
		'/path/to/other/views': container.viewPath()
	});
};

then.shouldHaveReceivedProviderAndOtherProvider = () => {
	then.shouldNotHaveThrown();
	expect(result.includes(serviceProvider)).toBe(true);
	expect(result.includes(otherServiceProvider)).toBe(true);
	expect(result).toHaveLength(2);
};

then.shouldHaveReceivedConfigAndViewsTag = () => {
	then.shouldNotHaveThrown();
	expect(result.includes('config')).toBe(true);
	expect(result.includes('views')).toBe(true);
	expect(result).toHaveLength(2);
};

then.shouldNotHavePublishable = () => {
	then.shouldNotHaveThrown();
	expect(ServiceProvider.getAllPublishable()).toStrictEqual({});
};


export default build({ given, when, then });
