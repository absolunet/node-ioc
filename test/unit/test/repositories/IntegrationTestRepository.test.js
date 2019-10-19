//--------------------------------------------------------
//-- Tests - Unit - Test - Repositories - End-To-End Test Repository
//--------------------------------------------------------

import gwt from './IntegrationTestRepository.gwt';
const { given, when, then } = gwt;


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
	given.emptyResult();
	given.emptyFilePath();
	given.emptyTestCaseInstance();
	given.methodName(undefined);
	given.fakeFileManager();
	given.IntegrationTestRepository();
	given.fakeTestPath();
});


test('Scopes for folder under "integration"', () => {
	when.gettingScope();
	then.resultShouldBe('integration');
});
