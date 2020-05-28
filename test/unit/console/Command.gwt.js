//--------------------------------------------------------
//-- Tests - Unit - Console - Command - GWT
//--------------------------------------------------------

import gwt from './common.gwt';
const { given, when, then, build } = gwt;

import container            from '../container';
import Command              from '../../../dist/node/console/Command';
import NotInstantiableError from '../../../dist/node/foundation/exceptions/NotInstantiableError';

let command;
let result;


//-- Mocks
//--------------------------------------------------------

const fakeTerminal = {};


//-- Given
//--------------------------------------------------------

given.emptyResult = () => {
	result = undefined;
};

given.fakeTerminal = () => {
	container.singleton('terminal', fakeTerminal);
};

given.abstractCommand = () => {
	command = Command;
};

given.commandExtendingAbstractCommand = () => {
	command = class extends Command {

		get name() { return 'fake:command'; }

	};
};


//-- When
//--------------------------------------------------------

when.makingCommand = () => {
	when.attempting(() => {
		result = container.make(command, {
			app:      container,
			terminal: container.make('terminal')
		});
	});
};


//-- Then
//--------------------------------------------------------

then.resultShouldBeInstanceOf = (expected) => {
	then.shouldNotHaveThrown();
	expect(result).toBeInstanceOf(expected);
};

then.shouldHaveThrownNotInstantiableError = () => {
	then.shouldHaveThrown();
	then.exceptionShouldBeInstanceOf(NotInstantiableError);
};

then.shouldHaveReceivedCommandInstance = () => {
	then.resultShouldBeInstanceOf(Command);
};


export default build({ given, when, then });
