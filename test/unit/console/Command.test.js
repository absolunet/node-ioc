//--------------------------------------------------------
//-- Tests - Unit - Console - Command
//--------------------------------------------------------

import gwt from './Command.gwt';
const { given, when, then } = gwt;


beforeEach(() => {
	given.emptyResult();
	given.providersAndDependencies();
	given.fakeTerminal();
});


test('Cannot instantiate an abstract command', () => {
	given.abstractCommand();
	when.makingCommand();
	then.shouldHaveThrownNotInstantiableError();
});

test('Can instantiate a command extending an abstract command', () => {
	given.commandExtendingAbstractCommand();
	when.makingCommand();
	then.shouldNotHaveThrown();
	then.shouldHaveReceivedCommandInstance();
});
