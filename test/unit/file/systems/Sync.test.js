//--------------------------------------------------------
//-- Tests - Unit - File - Systems - Sync
//--------------------------------------------------------

import gwt from './Sync.gwt';
const { given, when, then } = gwt;


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
	given.mockedAbsolunetFss();
	given.mockedReplaceInFile();
	given.syncSystem();
});


test('Should forward calls to @absolunet/fss instance', () => {
	when.callingScandir();
	then.scandirShouldHaveBeenCalledOnAbsolunetFss();
});

test('Should be able to replace a string in a file', () => {
	given.file();
	given.searchString();
	given.replace();
	when.replacingInFile();
	then.shouldHaveCalledReplaceInFile();
});

test('Should be able to replace a pattern in a file', () => {
	given.file();
	given.searchPatternWithFlags();
	given.replace();
	when.replacingInFile();
	then.shouldHaveCalledReplaceInFile();
	then.searchedPatternShouldContainFlagsAndDefaultOnes();
});

test('Should be able to replace a string in multiple files from a glob', () => {
	given.glob();
	given.searchString();
	given.replace();
	when.replacingInFile();
	then.shouldHaveCalledReplaceInFile();
});
