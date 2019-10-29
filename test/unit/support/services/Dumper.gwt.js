//--------------------------------------------------------
//-- Tests - Unit - Support - Services - Dumper - GWT
//--------------------------------------------------------

import gwt from '../common.gwt';
const { given, when, then, build } = gwt;

import container from '../../container';
import Dumper    from '../../../../dist/node/support/services/Dumper';

let result;
let dumper;
let data;
let otherData;


//-- Mocks
//--------------------------------------------------------

const fakeRenderedTemplate = 'fake rendered template';

const fakeTerminal = {
	echo: jest.fn()
};

const fakeViewFactory = {
	make: jest.fn(() => {
		return fakeRenderedTemplate;
	})
};

const fakeResponse = {
	status: jest.fn(() => {
		return fakeResponse;
	}),
	end: jest.fn()
};


//-- Given
//--------------------------------------------------------

given.emptyData = () => {
	data      = undefined;
	otherData = undefined;
};

given.emptyResult = () => {
	result = undefined;
};

given.fakeTerminal = () => {
	container.singleton('terminal', fakeTerminal);
};

given.fakeViewFactory = () => {
	container.singleton('view', fakeViewFactory);
};

given.fakeResponse = () => {
	dumper.setResponse(fakeResponse);
};

given.baseDevConfig = () => { // eslint-disable-line unicorn/prevent-abbreviations
	container.make('config').set('dev', {
		dumper: {
			'disabled_environments': [],
			'default': 'fake',
			'themes': {
				fake: {}
			}
		}
	});
};

given.dumper = () => {
	dumper = container.make(Dumper);
};

given.data = () => {
	data = {
		foo: 'bar',
		baz: true,
		qux: {}
	};
};

given.otherData = () => {
	otherData = {};
};

given.circularData = () => {
	given.data();
	data.self = data;
};

given.disabledTestEnvironmentInConfiguration = () => {
	container.make('config').set('dev.dumper.disabled_environments', [
		container.environment
	]);
};


//-- When
//--------------------------------------------------------

when.dumping = () => {
	when.attempting(() => {
		dumper.dump(...[data, otherData].filter(Boolean));
	});
};

when.gettingDump = () => {
	when.attempting(() => {
		result = dumper.getDump(...[data, otherData].filter(Boolean));
	});
};


//-- Then
//--------------------------------------------------------

then.resultShouldBe = (expected) => {
	then.shouldNotHaveThrown();
	expect(result).toBe(expected);
};

then.shouldHaveDumpedInResponse = () => {
	then.shouldNotHaveThrown();
	expect(fakeViewFactory.make).toHaveBeenCalled();
	const { calls } = fakeViewFactory.make.mock;
	expect(calls[calls.length - 1][0]).toBe('dumper::jsrender.index');
	expect(fakeResponse.status).toHaveBeenCalledWith(500);
	expect(fakeResponse.end).toHaveBeenCalledWith(fakeRenderedTemplate);
};

then.shouldNotHaveDumpedInResponse = () => {
	then.shouldNotHaveThrown();
	expect(fakeResponse.status).not.toHaveBeenCalled();
	expect(fakeResponse.end).not.toHaveBeenCalled();
};

then.shouldHaveDumpedInConsole = () => {
	then.shouldNotHaveThrown();
	expect(fakeTerminal.echo).toHaveBeenCalledTimes(1);
};

then.shouldHaveDumpedInConsoleTwice = () => {
	then.shouldNotHaveThrown();
	expect(fakeTerminal.echo).toHaveBeenCalledTimes(2);
};

then.shouldNotHaveDumpedInConsole = () => {
	then.shouldNotHaveThrown();
	expect(fakeTerminal.echo).not.toHaveBeenCalled();
};

then.shouldHaveReceivedDumpRenderedView = () => {
	then.resultShouldBe(fakeRenderedTemplate);
};

then.shouldHaveRenderedHtmlPartial = () => {
	then.shouldNotHaveThrown();
	expect(fakeViewFactory.make).toHaveBeenCalled();
	const { calls } = fakeViewFactory.make.mock;
	expect(calls[calls.length - 1][0]).toBe('dumper::jsrender.dump');
};

then.shouldNotHaveRendered = () => {
	then.shouldNotHaveThrown();
	expect(fakeViewFactory.make).not.toHaveBeenCalled();
};


export default build({ given, when, then });
