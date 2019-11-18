//--------------------------------------------------------
//-- Tests - Unit - Support - Commands - Vendor Publish
//--------------------------------------------------------

import gwt from './VendorPublishCommand.gwt';
const { given, when, then } = gwt;


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
	given.noPublishedFiles();
	given.fakeTerminal();
	given.fakeFileSystemAsync();
	given.emptyArgv();
	given.extensionServiceProvider();
	given.otherServiceProvider();
	given.commandRunner();
	given.vendorPublishCommand();
});

test('Does not publish anything if nothing has been published by service providers', async () => {
	await when.runningCommand();
	then.shouldNotHavePublishedAnything();
	then.shouldHavePrintedThatNothingWasPublished();
});

test('Publish all files if "all" flag is given', async () => {
	given.allFlag();

	given.extensionConfigFile('foo.yaml');
	given.otherConfigFile('bar.yaml');
	given.extensionTranslationsFile('baz.yaml');

	given.publishedExtensionConfigFolder();
	given.publishedOtherConfigFolder();
	given.publishedExtensionTranslationsFolder();

	await when.runningCommand();

	then.shouldHavePublishedExtensionConfigFile('foo.yaml');
	then.shouldHavePublishedOtherConfigFile('bar.yaml');
	then.shouldHavePublishedExtensionTranslationsFile('baz.yaml');
});

test('Publish all extension files if "provider" option with "Extension" value is given', async () => {
	given.providerOption('Extension');

	given.extensionConfigFile('foo.yaml');
	given.otherConfigFile('bar.yaml');
	given.extensionTranslationsFile('baz.yaml');

	given.publishedExtensionConfigFolder();
	given.publishedOtherConfigFolder();
	given.publishedExtensionTranslationsFolder();

	await when.runningCommand();

	then.shouldHavePublishedExtensionConfigFile('foo.yaml');
	then.shouldHavePublishedExtensionTranslationsFile('baz.yaml');
	then.shouldNotHavePublishedOtherConfigFile('bar.yaml');
});

test('Publish all config files if "tag" option with "config" value is given', async () => {
	given.tagOption('config');

	given.extensionConfigFile('foo.yaml');
	given.otherConfigFile('bar.yaml');
	given.extensionTranslationsFile('baz.yaml');

	given.publishedExtensionConfigFolder();
	given.publishedOtherConfigFolder();
	given.publishedExtensionTranslationsFolder();

	await when.runningCommand();

	then.shouldHavePublishedExtensionConfigFile('foo.yaml');
	then.shouldHavePublishedOtherConfigFile('bar.yaml');
	then.shouldNotHavePublishedExtensionTranslationsFile('baz.yaml');
});

test('Publish all extension config files if "provider" option with "Extension" value and "tag" option with "config" value are given', async () => {
	given.providerOption('Extension');
	given.tagOption('config');

	given.extensionConfigFile('foo.yaml');
	given.otherConfigFile('bar.yaml');
	given.extensionTranslationsFile('baz.yaml');

	given.publishedExtensionConfigFolder();
	given.publishedOtherConfigFolder();
	given.publishedExtensionTranslationsFolder();

	await when.runningCommand();

	then.shouldHavePublishedExtensionConfigFile('foo.yaml');
	then.shouldNotHavePublishedOtherConfigFile('bar.yaml');
	then.shouldNotHavePublishedExtensionTranslationsFile('baz.yaml');
});

test('Publish all files if all files option is chosen', async () => {
	given.extensionConfigFile('foo.yaml');
	given.otherConfigFile('bar.yaml');
	given.extensionTranslationsFile('baz.yaml');

	given.publishedExtensionConfigFolder();
	given.publishedOtherConfigFolder();
	given.publishedExtensionTranslationsFolder();

	const run = when.runningCommand();
	await when.answering('0');
	await run;

	then.shouldHavePublishedExtensionConfigFile('foo.yaml');
	then.shouldHavePublishedOtherConfigFile('bar.yaml');
	then.shouldHavePublishedExtensionTranslationsFile('baz.yaml');
});

test('Publish all Extension service provider files if Extension service provider option is chosen', async () => {
	given.extensionConfigFile('foo.yaml');
	given.otherConfigFile('bar.yaml');
	given.extensionTranslationsFile('baz.yaml');

	given.publishedExtensionConfigFolder();
	given.publishedOtherConfigFolder();
	given.publishedExtensionTranslationsFolder();

	const run = when.runningCommand();
	await when.answering('1');
	await run;

	then.shouldHavePublishedExtensionConfigFile('foo.yaml');
	then.shouldHavePublishedExtensionTranslationsFile('baz.yaml');
	then.shouldNotHavePublishedOtherConfigFile('bar.yaml');
});

test('Publish all Other service provider files if Other service provider option is chosen', async () => {
	given.extensionConfigFile('foo.yaml');
	given.otherConfigFile('bar.yaml');
	given.extensionTranslationsFile('baz.yaml');

	given.publishedExtensionConfigFolder();
	given.publishedOtherConfigFolder();
	given.publishedExtensionTranslationsFolder();

	const run = when.runningCommand();
	await when.answering('2');
	await run;

	then.shouldHavePublishedOtherConfigFile('bar.yaml');
	then.shouldNotHavePublishedExtensionConfigFile('foo.yaml');
	then.shouldNotHavePublishedExtensionTranslationsFile('baz.yaml');
});

test('Publish all config files if config tag option is chosen', async () => {
	given.extensionConfigFile('foo.yaml');
	given.otherConfigFile('bar.yaml');
	given.extensionTranslationsFile('baz.yaml');

	given.publishedExtensionConfigFolder();
	given.publishedOtherConfigFolder();
	given.publishedExtensionTranslationsFolder();

	const run = when.runningCommand();
	await when.answering('3');
	await run;

	then.shouldHavePublishedExtensionConfigFile('foo.yaml');
	then.shouldHavePublishedOtherConfigFile('bar.yaml');
	then.shouldNotHavePublishedExtensionTranslationsFile('baz.yaml');
});

test('Throws if unexisting extension is given as option', async () => {
	given.providerOption('Unexisting');

	given.extensionConfigFile('foo.yaml');
	given.otherConfigFile('bar.yaml');
	given.extensionTranslationsFile('baz.yaml');

	given.publishedExtensionConfigFolder();
	given.publishedOtherConfigFolder();
	given.publishedExtensionTranslationsFolder();

	await when.runningCommand();

	then.shouldHaveThrown();
	then.shouldNotHavePublishedAnything();
});

test('Throws if unexisting tag is given as option', async () => {
	given.tagOption('unexisting');

	given.extensionConfigFile('foo.yaml');
	given.otherConfigFile('bar.yaml');
	given.extensionTranslationsFile('baz.yaml');

	given.publishedExtensionConfigFolder();
	given.publishedOtherConfigFolder();
	given.publishedExtensionTranslationsFolder();

	await when.runningCommand();

	then.shouldHaveThrown();
	then.shouldNotHavePublishedAnything();
});

test('Throws if unexisting provider and tag are given as options', async () => {
	given.providerOption('unexisting');
	given.tagOption('unexisting');

	given.extensionConfigFile('foo.yaml');
	given.otherConfigFile('bar.yaml');
	given.extensionTranslationsFile('baz.yaml');

	given.publishedExtensionConfigFolder();
	given.publishedOtherConfigFolder();
	given.publishedExtensionTranslationsFolder();

	await when.runningCommand();

	then.shouldHaveThrown();
	then.shouldNotHavePublishedAnything();
});

test('Asks before overwriting existing files and overwrites if user confirms', async () => {
	given.allFlag();
	given.appConfigFile('foo.yaml');
	given.extensionConfigFile('foo.yaml');
	given.publishedExtensionConfigFolder();

	const run = when.runningCommand();
	await when.answering(true);
	await run;

	then.shouldHaveAskedForConfigOverwrite('foo.yaml');
	then.shouldHavePublishedExtensionConfigFile('foo.yaml');
});

test('Asks before overwriting existing files and does not overwrite if user denies', async () => {
	given.allFlag();
	given.appConfigFile('foo.yaml');
	given.extensionConfigFile('foo.yaml');
	given.publishedExtensionConfigFolder();

	const run = when.runningCommand();
	await when.answering(false);
	await run;

	then.shouldHaveAskedForConfigOverwrite('foo.yaml');
	then.shouldNotHavePublishedExtensionConfigFile('foo.yaml');
});

test('Overwrites existing files if "overwrite" flag is given', async () => {
	given.allFlag();
	given.overwriteFlag();
	given.appConfigFile('foo.yaml');
	given.extensionConfigFile('foo.yaml');
	given.publishedExtensionConfigFolder();

	await when.runningCommand();

	then.shouldNotHaveAskedConfirmation();
	then.shouldHavePublishedExtensionConfigFile('foo.yaml');
});

test('Does not overwrite existing files if "safe" flag is given', async () => {
	given.allFlag();
	given.safeFlag();
	given.appConfigFile('foo.yaml');
	given.extensionConfigFile('foo.yaml');
	given.publishedExtensionConfigFolder();

	await when.runningCommand();

	then.shouldNotHaveAskedConfirmation();
	then.shouldNotHavePublishedExtensionConfigFile('foo.yaml');
});

test('Throws if source file does not exists', async () => {
	given.allFlag();
	given.publishedExtensionFile('unexisting.yaml');
	await when.runningCommand();
	then.shouldHaveThrown();
	then.shouldNotHavePublishedAnything();
});
