//--------------------------------------------------------
//-- Tests - Unit - Test - Repositories - Unit Test Repository
//--------------------------------------------------------
'use strict';

const { given, when, then } = require('./UnitTestRepository.gwt');


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
	given.emptyResult();
	given.emptyFilePath();
	given.emptyTestCaseInstance();
	given.methodName(undefined);
	given.fakeFileManager();
	given.unitTestRepository();
	given.fakeTestPath();
});


test('Scopes for folder under "unit"', () => {
	when.gettingScope();
	then.resultShouldBe('unit');
});
