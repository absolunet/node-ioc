//--------------------------------------------------------
//-- Tests - Unit - Foundation - Exceptions - Handler drivers - Pretty Error Driver
//--------------------------------------------------------

import gwt from './PrettyErrorDriver.gwt';
const { given, when, then } = gwt;


beforeEach(() => {
	given.bootedContainer();
	given.mockedPrettyError();
	given.fakeTerminal();
	given.exception();
	given.prettyErrorDriver();
});


test('Can print exception in console', () => {
	when.renderingException();
	then.shouldHaveRenderedExceptionInConsole();
	then.shouldHaveUsedDefaultTerminalStyle();
});

test('Can use default terminal color', () => {
	given.magentaColorInTerminal();
	when.renderingException();
	then.shouldHaveUsedPurple();
});

test('Can use default terminal indent', () => {
	given.indentationOfSevenInTerminal();
	when.renderingException();
	then.shouldHaveUsedIndentationOfSeven();
});
