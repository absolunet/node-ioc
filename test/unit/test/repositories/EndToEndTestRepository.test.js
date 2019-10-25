//--------------------------------------------------------
//-- Tests - Unit - Test - Repositories - End-To-End Test Repository
//--------------------------------------------------------

import gwt from './EndToEndTestRepository.gwt';
const { given, when, then } = gwt;


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
	given.emptyResult();
	given.emptyFilePath();
	given.emptyTestCaseInstance();
	given.methodName(undefined);
	given.fakeFileManager();
	given.endToEndTestRepository();
	given.fakeTestPath();
});


test('Scopes for folder under "endtoend"', () => {
	when.gettingScope();
	then.resultShouldBe('endtoend');
});
