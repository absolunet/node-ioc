//--------------------------------------------------------
//-- Tests - Unit - Log - Services - Logger - Drivers - File Driver
//--------------------------------------------------------
'use strict';

const { given, when, then } = require('./FileDriver.gwt');


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
	given.fakeFileEngine();
	given.fileDriver();
	given.fileInConfig();
	given.message();
});

describe('Interface', () => {

	['debug', 'info', 'notice', 'warning', 'error', 'critical', 'alert', 'emergency'].forEach((method, index) => {

		test(`Can log a ${method} message with level as string`, async () => {
			given.level(method);
			await when.logging();
			then.shouldHaveLoggedInFileWithLevel(method);
		});

		test(`Can log a ${method} message with level as number`, async () => {
			given.level(index);
			await when.logging();
			then.shouldHaveLoggedInFileWithLevel(method);
		});

	});

});


test('Can change configuration', async () => {
	given.level('debug');
	await when.logging();
	when.changingForOtherFileInConfig();
	await when.loggingWithLevel('info');
	then.shouldHaveLoggedInFileWithLevel('debug');
	then.shouldHaveLoggedInOtherFileWithLevel('info');
});

test('Reduces file size when exceeding based on configuration', async () => {
	given.limit('1kb');
	given.fileOfSize(2000);
	given.level('debug');
	await when.logging();
	then.shouldHaveReducedFileSizeUnderSize(1024);
	then.shouldHaveLoggedInFile();
	then.fileShouldEndWithLastLog();
});

test('Does not reduce file size when not exceeding based on configuration', async () => {
	given.limit('1kb');
	given.fileOfSize(0);
	given.level('debug');
	await when.logging();
	then.shouldNotHaveReducedFile();
	then.shouldHaveLoggedInFile();
});

test('Throws an error if configured limit exceeds the driver threshold', async () => {
	given.limit('30mb');
	given.fileOfSize(0);
	given.level('debug');
	await when.logging();
	then.shouldHaveThrown();
	then.shouldNotHaveCalledFileEngine();
});
