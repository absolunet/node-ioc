//--------------------------------------------------------
//-- Tests - Unit - Support - Services - Dumper - GWT
//--------------------------------------------------------

import gwt from './Dumper.gwt';
const { given, when, then } = gwt;


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
	given.emptyResult();
	given.emptyFileName();
	given.fakeTerminal();
	given.fakeViewFactory();
	given.baseDevConfig();
	given.dumper();
});

test('Can dump data in full HTML page', () => {
	given.data();
	given.fakeResponse();
	when.dumping();
	then.shouldHaveDumpedInResponse();
	then.shouldNotHaveDumpedInConsole();
});

test('Can dump data in console if no response is provided', () => {
	given.data();
	when.dumping();
	then.shouldHaveDumpedInConsole();
	then.shouldNotHaveDumpedInResponse();
});

test('Can dump multiple objects in console', () => {
	given.data();
	given.otherData();
	when.dumping();
	then.shouldHaveDumpedInConsoleTwice();
	then.shouldNotHaveDumpedInResponse();
});

test('Can dump data in partial HTML for manual injection', () => {
	given.data();
	given.fakeResponse();
	when.gettingDump();
	then.shouldNotHaveDumpedInResponse();
	then.shouldNotHaveDumpedInConsole();
	then.shouldHaveReceivedDumpRenderedView();
	then.shouldHaveRenderedHtmlPartial();
});

test('Can dump circular object', () => {
	given.circularData();
	when.dumping();
	then.shouldNotHaveThrown();
});

test('Cannot dump if disabled, silently', () => {
	given.disabledDumperInConfiguration();
	given.data();
	given.fakeResponse();
	when.dumping();
	then.shouldNotHaveDumpedInResponse();
	then.shouldNotHaveDumpedInConsole();
	then.shouldNotHaveRendered();
});

test('Cannot get dump if disabled, silently', () => {
	given.disabledDumperInConfiguration();
	given.data();
	given.fakeResponse();
	when.gettingDump();
	then.shouldNotHaveDumpedInResponse();
	then.shouldNotHaveDumpedInConsole();
	then.shouldNotHaveRendered();
});

test('Can dump with a specific file name', () => {
	given.data();
	given.fakeResponse();
	given.fileName();
	when.dumpingForFile();
	then.shouldHaveDumpedInResponse();
	then.shouldHaveUsedGivenFileName();
	then.shouldNotHaveDumpedInConsole();
});

test('Can get dump with a specific file name', () => {
	given.data();
	given.fakeResponse();
	given.fileName();
	when.gettingDumpForFile();
	then.shouldNotHaveDumpedInResponse();
	then.shouldNotHaveDumpedInConsole();
	then.shouldHaveReceivedDumpRenderedView();
	then.shouldHaveRenderedHtmlPartial();
	then.shouldHaveUsedGivenFileName();
});
