//--------------------------------------------------------
//-- Tests - Unit - Test - Repositories - Feature Test Repository
//--------------------------------------------------------

import gwt from './FeatureTestRepository.gwt';
const { given, when, then } = gwt;


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
