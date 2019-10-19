//--------------------------------------------------------
//-- Tests - Unit - File - Systems - Async
//--------------------------------------------------------

import gwt from './Async.gwt';
const { given, when, then } = gwt;


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
	given.mockedAbsolunetFsp();
	given.mockedReplaceInFile();
	given.asyncSystem();
});


test('Should forward calls to @absolunet/fsp instance', async () => {
	await when.callingScandir();
	then.scandirShouldHaveBeenCalledOnAbsolunetFsp();
});

test('Should be able to replace a string in a file', async () => {
	given.file();
	given.searchString();
	given.replace();
	await when.replacingInFile();
	then.shouldHaveCalledReplaceInFile();
});

test('Should be able to replace a pattern in a file', async () => {
	given.file();
	given.searchPatternWithFlags();
	given.replace();
	await when.replacingInFile();
	then.shouldHaveCalledReplaceInFile();
	then.searchedPatternShouldContainFlagsAndDefaultOnes();
});

test('Should be able to replace a string in multiple files from a glob', async () => {
	given.glob();
	given.searchString();
	given.replace();
	await when.replacingInFile();
	then.shouldHaveCalledReplaceInFile();
});
