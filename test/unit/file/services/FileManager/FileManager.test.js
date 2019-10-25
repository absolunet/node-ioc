//--------------------------------------------------------
//-- Tests - Unit - File - Services - File Manager
//--------------------------------------------------------

import gwt from './FileManager.gwt';
const { given, when, then } = gwt;


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
	given.emptyResult();
	given.fakeFileEngine();
	given.fileManager();
	given.fakeJavaScriptDriver();
	given.fakeJsonDriver();
	given.fakeYamlDriver();
	given.fakeTextDriver();
});


test('Can load a text file', () => {
	given.textFilePath();
	when.loadingFile();
	then.fileShouldHaveBeenLoadedThroughTextDriver();
});

test('Can load a javascript file', () => {
	given.javaScriptFilePath();
	when.loadingFile();
	then.fileShouldHaveBeenLoadedThroughJavaScriptDriver();
});

test('Can load a json file', () => {
	given.jsonFilePath();
	when.loadingFile();
	then.fileShouldHaveBeenLoadedThroughJsonDriver();
});

test('Can load a yaml file', () => {
	given.yamlFilePath();
	when.loadingFile();
	then.fileShouldHaveBeenLoadedThroughYamlDriver();
});

test('Can load a yml file', () => {
	given.ymlFilePath();
	when.loadingFile();
	then.fileShouldHaveBeenLoadedThroughYamlDriver();
});

test('Can load a log file as text', () => {
	given.logFilePath();
	when.loadingFile();
	then.fileShouldHaveBeenLoadedThroughTextDriver();
});

test('Can load a file asynchronously', async () => {
	given.textFilePath();
	await when.loadingFileAsynchronously();
	then.shouldHaveLoadedFileAsynchronouslyThroughTextDriver();
});

test('Can check if file exists', () => {
	given.textFilePath();
	when.checkingIfExists();
	then.shouldHaveCheckedIfExistsThroughFileEngine();
});

test('Can get first found file in a given collection', () => {
	given.textFilePathCollection();
	when.gettingFirstFoundPath();
	then.shouldHaveReceivedFirstFoundPathInCollection();
	then.shouldHaveCheckedIfAllFilesExistThroughFileEngineUntilOneFound();
});

test('Can load first found file in a given collection', () => {
	given.textFilePathCollection();
	when.loadingFirstFoundPath();
	then.shouldHaveReceivedFirstFoundPathContentInCollection();
	then.shouldHaveCheckedIfAllFilesExistThroughFileEngineUntilOneFound();
	then.firstFoundPathShouldHaveBeenLoadedThroughTextDriver();
});

test('Does not throw if loading unexisting file collection', () => {
	given.unexistingFilePathCollection();
	when.loadingFirstFoundPath();
	then.resultShouldBe(null);
});

test('Can load all files in a given folder', () => {
	given.folder();
	when.loadingFolder();
	then.allFilesInFolderShouldHaveBeenLoadedThroughAppropriateDrivers();
	then.shouldHaveReceivedDictionaryAssociatingFileNameWithLoadedContent();
});

test('Can load all files recursively in a given folder', () => {
	given.folder();
	when.loadingFolderRecursively();
	then.shouldHaveScandirThroughFileEngineWithRecursiveOption();
	then.allFilesInFolderShouldHaveBeenLoadedThroughAppropriateDrivers();
	then.shouldHaveReceivedDictionaryAssociatingFileNameWithLoadedContent();
});

test('Can scan directory for files', () => {
	given.folder();
	given.fileType();
	when.scanningDirectory();
	then.shouldHaveReturnedScandirThroughFileEngineWithTypeFile();
});

test('Can scan directory for folder', () => {
	given.folder();
	given.folderType();
	when.scanningDirectory();
	then.shouldHaveReturnedScandirThroughFileEngineWithTypeFolder();
});

test('Can write content in a given destination', () => {
	given.writeJsonFilePath();
	given.jsonContent();
	when.writing();
	then.shouldHaveWrittenFileThroughJsonDriver();
});

test('Can write content asynchronously in a given destination', async () => {
	given.writeJsonFilePath();
	given.jsonContent();
	await when.writingAsynchronously();
	then.shouldHaveWrittenAsynchronouslyFileThroughJsonDriver();
});
