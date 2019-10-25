//--------------------------------------------------------
//-- Tests - Unit - HTTP - Services - Server - GWT
//--------------------------------------------------------

import gwt from '../common.gwt';
const { given, when, then, build } = gwt;

import container from '../../container';
import Server    from '../../../../dist/node/http/services/Server';

let result;
let server;
let instance;
let mockedExpress;
let fakeExpressRouter;


//-- Given
//--------------------------------------------------------

given.emptyResult = () => {
	result = undefined;
};

given.emptyInstance = () => {
	instance = undefined;
};

given.server = () => {
	server = container.make(Server);
};

given.instance = () => {
	instance = server.getInstance();
};

given.mockedExpress = () => {
	jest.mock('express', () => {
		const router = {};
		fakeExpressRouter = router;
		mockedExpress = {
			Router: jest.fn(() => { return router; })
		};

		return mockedExpress;
	});
};


//-- When
//--------------------------------------------------------

when.making = () => {
	when.attempting(() => {
		result = server.make();
	});
};

when.gettingInstance = () => {
	when.attempting(() => {
		result = server.getInstance();
	});
};

when.checkingIfHasInstance = () => {
	when.attempting(() => {
		result = server.hasInstance();
	});
};

when.gettingExpress = () => {
	when.attempting(() => {
		result = server.express;
	});
};

when.gettingRouter = () => {
	when.attempting(() => {
		result = server.getRouter();
	});
};


//-- Then
//--------------------------------------------------------

then.resultShouldBe = (expected) => {
	then.shouldNotHaveThrown();
	expect(result).toBe(expected);
};

then.shouldHaveInstance = () => {
	then.shouldNotHaveThrown();
	expect(result).toBeTruthy();
	expect(typeof result.listen).toBe('function');
};

then.shouldHaveSameInstance = () => {
	then.resultShouldBe(instance);
};

then.shouldHaveExpressModule = () => {
	then.resultShouldBe(require('express')); // eslint-disable-line global-require
};

then.shouldHaveReceivedExpressRouter = () => {
	then.resultShouldBe(fakeExpressRouter);
};


export default build({ given, when, then });
