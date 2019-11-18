//--------------------------------------------------------
//-- Tests - Unit - Foundation - Service Provider
//--------------------------------------------------------

import gwt from './ServiceProvider.gwt';
const { given, when, then } = gwt;


beforeEach(() => {
	given.emptyResult();
	given.provider();
	given.otherProvider();
});

test('Can load configuration into the config repository', () => {
	given.fakeConfigRepository();
	when.loadingConfig();
	then.configShouldHaveBeenLoaded();
});

test('Does not throw while loading configuration if config repository was not bound yet', () => {
	when.loadingConfig();
	then.shouldNotHaveThrown();
});

test('Can load commands into the command repository', () => {
	given.fakeCommandRepository();
	given.fakeCommands();
	when.loadingCommands();
	then.commandShouldHaveBeenLoaded();
});

test('Does not throw while loading commands if command repository was not bound yet', () => {
	given.fakeCommands();
	when.loadingCommands();
	then.shouldNotHaveThrown();
});

test('Can load translations into the translator service', () => {
	given.fakeTranslator();
	given.fakeFileManager();
	given.fakeTranslationsFile();
	when.loadingTranslations();
	then.translationsShouldHaveBeenLoaded();
});

test('Does not throw while loading translations if translator was not bound yet', () => {
	given.fakeFileManager();
	given.fakeTranslationsFile();
	when.loadingTranslations();
	then.shouldNotHaveThrown();
});

test('Does not throw while loading translations if file manager was not bound yet', () => {
	given.fakeTranslator();
	given.fakeTranslationsFile();
	when.loadingTranslations();
	then.shouldNotHaveThrown();
});

test('Does not throw while loading translations if file manager and translator were not bound yet', () => {
	given.fakeTranslationsFile();
	when.loadingTranslations();
	then.shouldNotHaveThrown();
});

test('Can load views into the view resolver', () => {
	given.fakeViewResolver();
	when.loadingViews();
	then.viewsShouldHaveBeenLoaded();
});

test('Can load views with namespace into the view resolver', () => {
	given.fakeViewResolver();
	when.loadingViewsWithNamespace();
	then.viewsShouldHaveBeenLoadedWithNamespace();
});

test('Does not throw while loading views if the view resolver was not bound yet', () => {
	when.loadingViewsWithNamespace();
	then.shouldNotHaveThrown();
});

test('Can add publishable file', () => {
	when.publishingFile();
	then.shouldHaveAddedFileToBePublished();
});

test('Can add publishable folder', () => {
	when.publishingFolder();
	then.shouldHaveAddedFolderToBePublished();
});

test('Can tag publishable', () => {
	when.publishingFileWithTag();
	then.shouldHaveAddedTagToPublishedFile();
});

test('Can publish assets', () => {
	when.publishingAssets();
	then.assetsShouldBePublishable();
});

test('Can publish config', () => {
	when.publishingConfig();
	then.configShouldBePublishable();
});

test('Can publish stub migration', () => {
	given.fakeFileManager();
	given.fakeDatabaseResolver();
	given.fakeDateHelper();
	given.fakePathHelper();
	given.stubMigration();
	when.publishingMigration();
	then.migrationShouldBePublishable();
});

test('Cannot publish JavaScript migration', () => {
	given.fakeFileManager();
	given.fakeDatabaseResolver();
	given.fakeDateHelper();
	given.fakePathHelper();
	given.javaScriptMigration();
	when.publishingMigration();
	then.migrationShouldNotBePublishable();
});

test('Does not throw while publishing migrations if file manager was not bound yet', () => {
	given.fakeDatabaseResolver();
	given.fakeDateHelper();
	given.fakePathHelper();
	given.stubMigration();
	when.publishingMigration();
	then.shouldNotHaveThrown();
});

test('Does not throw while publishing migrations if date helper was not bound yet', () => {
	given.fakeFileManager();
	given.fakeDatabaseResolver();
	given.fakePathHelper();
	given.stubMigration();
	when.publishingMigration();
	then.shouldNotHaveThrown();
});

test('Does not throw while publishing migrations if path helper was not bound yet', () => {
	given.fakeFileManager();
	given.fakeDatabaseResolver();
	given.fakeDateHelper();
	given.stubMigration();
	when.publishingMigration();
	then.shouldNotHaveThrown();
});

test('Does not throw while publishing migrations if database resolver was not bound yet', () => {
	given.fakeFileManager();
	given.fakeDateHelper();
	given.fakePathHelper();
	given.stubMigration();
	when.publishingMigration();
	then.shouldNotHaveThrown();
});

test('Can publish translations', () => {
	when.publishingTranslations();
	then.translationsShouldBePublishable();
});

test('Can publish views', () => {
	when.publishingViews();
	then.viewsShouldBePublishable();
});

test('Can publish views in dedicated views folder', () => {
	when.publishingViewsInFolder();
	then.viewsShouldBePublishableInFolder();
});

test('Can load and publish config', () => {
	given.fakeConfigRepository();
	when.loadingAndPublishingConfig();
	then.configShouldHaveBeenLoaded();
	then.configShouldBePublishable();
});

test('Can load and publish translations', () => {
	given.fakeTranslator();
	given.fakeFileManager();
	given.fakeTranslationsFile();
	when.loadingAndPublishingTranslations();
	then.translationsShouldHaveBeenLoaded();
	then.translationsShouldBePublishable();
});

test('Can load and publish views', () => {
	given.fakeViewResolver();
	when.loadingAndPublishingViews();
	then.viewsShouldHaveBeenLoaded();
	then.viewsShouldBePublishable();
});

test('Can load and publish views with namespace', () => {
	given.fakeViewResolver();
	when.loadingAndPublishingViewsWithNamespace();
	then.viewsShouldHaveBeenLoadedWithNamespace();
	then.viewsShouldBePublishableInFolder();
});

test('Can publish multiple times from same provider', () => {
	when.publishingAssets();
	when.publishingOtherAssets();
	when.publishingConfig();
	when.publishingOtherConfig();
	when.publishingTranslations();
	when.publishingOtherTranslations();
	when.publishingViews();
	when.publishingOtherViews();

	then.assetsShouldBePublishable();
	then.otherAssetsShouldBePublishable();
	then.configShouldBePublishable();
	then.otherConfigShouldBePublishable();
	then.translationsShouldBePublishable();
	then.otherTranslationsShouldBePublishable();
	then.viewsShouldBePublishable();
	then.otherViewsShouldBePublishable();
});

test('Can get publishable providers', () => {
	given.publishedConfig();
	given.publishedConfigByOtherProvider();
	when.gettingPublishableProviders();
	then.shouldHaveReceivedProviderAndOtherProvider();
});

test('Can get publishable tags', () => {
	given.publishedConfig();
	given.publishedConfigByOtherProvider();
	given.publishedViews();
	when.gettingPublishableTags();
	then.shouldHaveReceivedConfigAndViewsTag();
});

test('Can reset publishable when flushing application', () => {
	given.publishedViews();
	when.flushingApplication();
	then.shouldNotHavePublishable();
});
