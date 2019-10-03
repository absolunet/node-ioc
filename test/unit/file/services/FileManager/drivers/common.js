//--------------------------------------------------------
//-- Tests - Unit - File - Services - File Manager - Drivers - Common tests
//--------------------------------------------------------
'use strict';


module.exports = ({ given, when, then }) => {

	beforeEach(() => {
		given.providersAndDependencies();
		given.bootedContainer();
		given.emptyResult();
		given.currentDriver();
		given.currentDriverContent();
	});

	test('Can load file', () => {
		given.file();
		when.loadingFile();
		then.fileShouldHaveBeenLoaded();
	});

	test('Can load file asynchronously', async () => {
		given.file();
		await when.loadingFileAsynchronously();
		then.fileShouldHaveBeenLoaded();
	});

	test('Can write file', () => {
		given.writeFile();
		when.writingFile();
		then.fileShouldHaveBeenWritten();
		then.deleteWrittenFile();
	});

	test('Can write file asynchronously', async () => {
		given.writeFile();
		await when.writingFileAsynchronously();
		then.fileShouldHaveBeenWritten();
		then.deleteWrittenFile();
	});

};
