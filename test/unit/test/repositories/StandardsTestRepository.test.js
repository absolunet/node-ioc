//--------------------------------------------------------
//-- Tests - Unit - Test - Repositories - Standards Test Repository
//--------------------------------------------------------
'use strict';

const { given, when, then } = require('./StandardsTestRepository.gwt');


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
	given.emptyResult();
	given.emptyFilePath();
	given.emptyTestCaseInstance();
	given.methodName(undefined);
	given.fakeFileManager();
	given.standardsTestRepository();
	given.fakeTestPath();
});


test('Scopes for folder under "standards"', () => {
	when.gettingScope();
	then.resultShouldBe('standards');
});
