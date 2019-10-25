//--------------------------------------------------------
//-- Tests - Unit - Foundation - Exceptions - Handler drivers - Pretty Error Driver - GWT
//--------------------------------------------------------

import gwt from '../../../common.gwt';
const { given, when, then, build } = gwt;

import chalk from 'chalk';
import container from '../../../../container';
import PrettyErrorDriver from '../../../../../../dist/node/foundation/exceptions/Handler/drivers/PrettyErrorDriver';

let prettyErrorDriver;
let exception;


//-- Mocks
//--------------------------------------------------------

const fakeException = new TypeError('An error has occurred...');

const fakeRenderedException = 'An error has occurred...';

const mockedPrettyError = {
	appendStyle: jest.fn(() => {
		return mockedPrettyError;
	}),
	render: jest.fn(() => {
		return fakeRenderedException;
	})
};

const mockedPrettyErrorConstructor = jest.fn(() => {
	return mockedPrettyError;
});

const fakeTerminal = {
	defaults: {
		textColor: chalk.blue,
		indent: 2
	},
	spacer: jest.fn(),
	echo:   jest.fn(),
	chalk
};



//-- Given
//--------------------------------------------------------

given.bootedContainer = () => {
	container.bootIfNotBooted();
};

given.mockedPrettyError = () => {
	jest.mock('pretty-error', () => {
		return mockedPrettyErrorConstructor;
	});
};

given.fakeTerminal = () => {
	container.singleton('terminal', fakeTerminal);
};

given.exception = () => {
	exception = fakeException;
};

given.prettyErrorDriver = () => {
	prettyErrorDriver = container.make(PrettyErrorDriver);
};

given.magentaColorInTerminal = () => {
	fakeTerminal.defaults.textColor = chalk.magenta;
};

given.indentationOfSevenInTerminal = () => {
	fakeTerminal.defaults.indent = 7;
};


//-- When
//--------------------------------------------------------

when.renderingException = () => {
	when.attempting(() => {
		prettyErrorDriver.render(exception);
	});
};


//-- Then
//--------------------------------------------------------

then.shouldHaveRenderedExceptionInConsole = () => {
	then.shouldNotHaveThrown();
	expect(mockedPrettyError.render).toHaveBeenCalledWith(exception);
	expect(fakeTerminal.spacer).toHaveBeenCalledTimes(1);
	expect(fakeTerminal.echo).toHaveBeenCalledTimes(1);
};

then.shouldHaveUsedDefaultTerminalStyle = () => {
	then.shouldHaveUsedColor('blue');
	then.shouldHaveUsedIndentation(2);
};

then.shouldHaveUsedColor = (color) => {
	then.shouldNotHaveThrown();
	expect(mockedPrettyError.appendStyle).toHaveBeenCalledTimes(1);
	expect(mockedPrettyError.appendStyle.mock.calls[0][0]).toMatchObject({
		'pretty-error > trace > item > header > pointer > file': {
			color
		}
	});
};

then.shouldHaveUsedIndentation = (indentation) => {
	then.shouldNotHaveThrown();
	expect(mockedPrettyError.appendStyle).toHaveBeenCalledTimes(1);
	expect(mockedPrettyError.appendStyle.mock.calls[0][0]).toMatchObject({
		'pretty-error': {
			paddingLeft: indentation
		}
	});
};

then.shouldHaveUsedPurple = () => {
	then.shouldHaveUsedColor('magenta');
};

then.shouldHaveUsedIndentationOfSeven = () => {
	then.shouldHaveUsedIndentation(7);
};


export default build({ given, when, then });
