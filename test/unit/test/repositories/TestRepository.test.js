//--------------------------------------------------------
//-- Tests - Unit - Test - Repositories - Test Repository
//--------------------------------------------------------
'use strict';

const { given, when, then } = require('./TestRepository.gwt');


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
	given.emptyResult();
	given.emptyFilePath();
	given.emptyTestCaseInstance();
	given.methodName(undefined);
	given.fakeFileManager();
	given.testRepository();
	given.fakeTestPath();
});

test('Uses application test path by default', () => {
	when.gettingFiles();
	then.shouldHaveSearchedInFakeTestPath();
});

test('Can use custom test path regardless of the application test path', () => {
	given.customBasePath();
	when.gettingFiles();
	then.shouldHaveSearchedInCustomBasePath();
});

test('Aims for files ending in "Test.js" instead of ".test.js', () => {
	given.fileInFakeTestPath('index.test.js');
	given.fileInFakeTestPath('IndexTest.js');
	given.fileInFakeTestPath('TestIndex.js');
	when.gettingFiles();
	then.shouldHaveReceivedFilesNamed(['IndexTest.js']);
});

test('Can aim for custom file pattern', () => {
	given.customFilePattern('Test[A-Z]\\w*.js');
	given.fileInFakeTestPath('index.test.js');
	given.fileInFakeTestPath('IndexTest.js');
	given.fileInFakeTestPath('TestIndex.js');
	when.gettingFiles();
	then.shouldHaveReceivedFilesNamed(['TestIndex.js']);
});

test('Can get all files under base path', () => {
	given.fileInFakeTestPath('FooTest.js');
	given.fileInFakeTestPath('unit/FooTest.js');
	given.fileInFakeTestPath('feature/FooTest.js');
	when.gettingFromNamespace('');
	then.shouldHaveReceivedFileObjectsNamed(['FooTest.js', 'unit/FooTest.js', 'feature/FooTest.js']);
});

test('Can get all files under base path with a given namespace', () => {
	given.fileInFakeTestPath('FooTest.js');
	given.fileInFakeTestPath('unit/FooTest.js');
	given.fileInFakeTestPath('feature/FooTest.js');
	when.gettingFromNamespace('unit');
	then.shouldHaveReceivedFileObjectsNamed(['unit/FooTest.js']);
});

test('Can get all files under base path when scope is configured', () => {
	given.scopedTestRepository();
	given.fileInFakeTestPath('FooTest.js');
	given.fileInFakeTestPath('unit/FooTest.js');
	given.fileInFakeTestPath('unit/foo/FooTest.js');
	given.fileInFakeTestPath('feature/FooTest.js');
	when.gettingAll();
	then.shouldHaveReceivedFileObjectsNamed(['unit/FooTest.js', 'unit/foo/FooTest.js']);
});

test('Can get all files under base path with a given name space when scope is configured', () => {
	given.scopedTestRepository();
	given.fileInFakeTestPath('FooTest.js');
	given.fileInFakeTestPath('unit/FooTest.js');
	given.fileInFakeTestPath('unit/foo/FooTest.js');
	given.fileInFakeTestPath('feature/FooTest.js');
	when.gettingFromNamespace('');
	then.shouldHaveReceivedFileObjectsNamed(['unit/FooTest.js', 'unit/foo/FooTest.js']);
});

test('Can get namespace of a file from its absolute path', () => {
	given.fileFromTestPath('foo/bar/BazTest.js');
	when.gettingNamespaceFromFile();
	then.resultShouldBe('foo/bar');
});

test('Can get namespace of a file from its absolute path', () => {
	given.fileFromTestPath('foo/bar/BazTest.js');
	when.gettingNamespaceFromFile();
	then.resultShouldBe('foo/bar');
});
test('Can get human-readable namespace of a file from its absolute path', () => {
	given.fileFromTestPath('foo/bar/BazTest.js');
	when.gettingFormattedNamespaceFromFile();
	then.resultShouldBe('Foo > Bar');
});

test('Can get human-readable name of a test case from its path', () => {
	given.fileFromTestPath('foo/bar/BazQuxTest.js');
	when.gettingFormattedNameFromFile();
	then.resultShouldBe('Baz Qux');
});

test('Can get all tests methods of a given test case instance', () => {
	given.testCaseInstance();
	when.gettingAllTestMethods();
	then.shouldHaveReceivedTestCaseInstanceTestMethodNamesOnly();
});

test('Can get all methods of a given test case instance', () => {
	given.testCaseInstance();
	when.gettingAllMethods();
	then.shouldHaveReceivedTestCaseInstanceMethodNames();
});

test('Can get test method human-readable description', () => {
	given.methodName('testSomethingToTest');
	when.gettingFormattedDescription();
	then.resultShouldBe('Something to test');
});
