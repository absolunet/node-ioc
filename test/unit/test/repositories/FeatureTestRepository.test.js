//--------------------------------------------------------
//-- Tests - Unit - Test - Repositories - Feature Test Repository
//--------------------------------------------------------
'use strict';

const { given, when, then } = require('./FeatureTestRepository.gwt');


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
	given.emptyResult();
	given.emptyFilePath();
	given.emptyTestCaseInstance();
	given.methodName(undefined);
	given.fakeFileManager();
	given.featureTestRepository();
	given.fakeTestPath();
});


test('Scopes for folder under "feature"', () => {
	when.gettingScope();
	then.resultShouldBe('feature');
});
