//--------------------------------------------------------
//-- Tests - Unit - HTTP - HTTP Service Provider - GWT
//--------------------------------------------------------

import gwt from './common.gwt';
const { given, when, then, build } = gwt;

import container          from '../container';
import RedirectController from '../../../dist/node/http/controllers/RedirectController';
import StaticController   from '../../../dist/node/http/controllers/StaticController';


//-- Mocks
//--------------------------------------------------------

const fakeControllerRepository = {
	group: jest.fn((namespace, callback) => {
		callback();
	}),
	add: jest.fn()
};


//-- Given
//--------------------------------------------------------

given.fakeControllerRepository = () => {
	container.decorate('router.controller', () => {
		return fakeControllerRepository;
	});
};


//-- Then
//--------------------------------------------------------

then.httpClientShouldBeResolvable = () => {
	then.serviceShouldBeResolvable('http');
};

then.httpClientShouldBeSingleton = () => {
	then.shouldHaveSingleton('http');
};

then.httpServerShouldBeResolvable = () => {
	then.serviceShouldBeResolvable('server');
};

then.httpServerShouldBeSingleton = () => {
	then.shouldHaveSingleton('server');
};

then.routerServiceShouldBeResolvable = () => {
	then.serviceShouldBeResolvable('router');
};

then.routerServiceShouldBeSingleton = () => {
	then.shouldHaveSingleton('router');
};

then.handlerServiceShouldBeResolvable = () => {
	then.serviceShouldBeResolvable('router.handler');
};

then.handlerServiceShouldBeSingleton = () => {
	then.shouldHaveSingleton('router.handler');
};

then.controllerRepositoryShouldBeResolvable = () => {
	then.serviceShouldBeResolvable('router.controller');
};

then.controllerRepositoryShouldBeSingleton = () => {
	then.shouldHaveSingleton('router.controller');
};

then.routeRepositoryShouldBeResolvable = () => {
	then.serviceShouldBeResolvable('router.route');
};

then.routeRepositoryShouldBeSingleton = () => {
	then.shouldHaveSingleton('router.route');
};

then.controllerShouldBeRegistered = (name, concrete) => {
	then.shouldNotHaveThrown();
	const wasRegistered = fakeControllerRepository.add.mock.calls.some(([givenName, givenConcrete]) => {
		return givenName === name && givenConcrete === concrete;
	});
	expect(wasRegistered).toBe(true);
};

then.redirectControllerShouldBeRegistered = () => {
	then.controllerShouldBeRegistered('RedirectController', RedirectController);
};

then.staticControllerShouldBeRegistered = () => {
	then.controllerShouldBeRegistered('StaticController', StaticController);
};


export default build({ given, when, then });
