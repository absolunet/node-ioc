//--------------------------------------------------------
//-- Tests - Unit - HTTP - Services - Router - GWT
//--------------------------------------------------------
'use strict';

const { given, when, then, build } = require('../common.gwt');

const container = require('../../container');
const Router    = require('../../../../dist/node/http/services/Router');
const Route     = require('../../../../dist/node/http/Route');

let result;
let router;
let action;
let uriPath;
let fakeRoutes;
let fakeInternalCallResultHandler;


//-- Mocks
//--------------------------------------------------------

const fakeExpress = {
	use: jest.fn(() => {
		return fakeExpress;
	}),
	runMiddleware: jest.fn((path, request, handler) => { return new Promise(handler); })
};

const fakeRouter = {
	'get':    jest.fn(),
	'post':   jest.fn(),
	'put':    jest.fn(),
	'patch':  jest.fn(),
	'delete': jest.fn()
};

const fakeServer = {
	getRouter: jest.fn(() => {
		return fakeRouter;
	}),
	make: jest.fn(() => {
		return fakeExpress;
	})
};

const fakeInternalCallResultHandlerFactory = jest.fn((resolve) => {
	fakeInternalCallResultHandler = jest.fn((code, data) => {
		resolve({ code, data });
	});

	return fakeInternalCallResultHandler;
});

const fakeHandler = {
	handleRequest: jest.fn(() => { return Promise.resolve(); }),
	prepareHandling: jest.fn(),
	get getInternalCallResultHandler() { return fakeInternalCallResultHandlerFactory; }
};

const fakeRouteRepository = {
	add: jest.fn((route) => {
		fakeRoutes.push(route);
	}),
	all: jest.fn(() => {
		return [...fakeRoutes];
	}),
	findByName: jest.fn((name) => {
		return fakeRoutes.find(({ as }) => {
			return as === name;
		});
	})
};

const fakeControllerRepository = {
	add:   jest.fn(),
	group: jest.fn(),
	namespaceSeparator: '.',
	coreNamespace: 'core'
};

const fakeController = {};

const fakeClosureActionSpy = jest.fn();
const fakeClosureAction    = (...parameters) => { return fakeClosureActionSpy(...parameters); };
const fakeControllerName   = 'FakeController';
const fakeControllerAction = `${fakeControllerName}@action`;

const fakeControllerGroupCallback = jest.fn();

const fakeGetRouteActionSpy  = jest.fn();
const otherGetRouteActionSpy = jest.fn();

const fakeGetRouteAction  = (...parameters) => { return fakeGetRouteActionSpy(...parameters); };
const otherGetRouteAction = (...parameters) => { return otherGetRouteActionSpy(...parameters); };
const fakeGetRoute  = new Route({ method: 'get', path: '/foo/bar', as: 'fake',  action: fakeGetRouteAction });
const otherGetRoute = new Route({ method: 'get', path: '/baz/qux', as: 'other', action: otherGetRouteAction });


//-- Given
//--------------------------------------------------------

given.emptyResult = () => {
	result = undefined;
};

given.fakeServer = () => {
	container.singleton('server', fakeServer);
};

given.fakeHandler = () => {
	container.singleton('router.handler', fakeHandler);
	fakeInternalCallResultHandler = undefined;
};

given.fakeRouteRepository = () => {
	container.singleton('router.route', fakeRouteRepository);
	fakeRoutes = [];
};

given.fakeControllerRepository = () => {
	container.singleton('router.controller', fakeControllerRepository);
};

given.router = () => {
	router = container.make(Router);
};

given.action = (value) => {
	action = value;
};

given.closureAction = () => {
	given.action(fakeClosureAction);
};

given.controllerAction = () => {
	given.action(fakeControllerAction);
};

given.path = (value) => {
	uriPath = value;
};

given.getRoute = () => {
	fakeRoutes.push(fakeGetRoute);
};

given.otherGetRoute = () => {
	fakeRoutes.push(otherGetRoute);
};


//-- When
//--------------------------------------------------------

when.creatingRouteWithMethod = (method) => {
	when.attempting(() => {
		result = router[method](uriPath, action);
	});
};

when.creatingFallbackRoute = () => {
	when.attempting(() => {
		result = router.fallback(action);
	});
};

when.creatingRedirection = (from, to) => {
	when.attempting(() => {
		result = router.redirect(from, to);
	});
};

when.creatingPermanentRedirection = (from, to) => {
	when.attempting(() => {
		result = router.permanentRedirect(from, to);
	});
};

when.creatingStaticRoute = (path, folder) => {
	when.attempting(() => {
		result = router.static(path, folder);
	});
};

when.addingRoute = (method, path) => {
	when.attempting(() => {
		result = router.addRoute(method, path, action);
	});
};

when.creatingGroupWithOptionsAndCallback = (options, callback) => {
	when.attempting(() => {
		result = router.group(options, callback);
	});
};

when.creatingGroupWithOneClosureRoute = () => {
	when.creatingGroupWithOptionsAndCallback({}, (givenRouter) => {
		givenRouter.get('/route-in-group', fakeClosureAction).name('route.in.group');
	});
};

when.creatingGroupWithOneClosureRouteWithPrefix = (prefix) => {
	when.creatingGroupWithOptionsAndCallback({ prefix }, (givenRouter) => {
		givenRouter.get('/route-in-group', fakeClosureAction).name('route.in.group');
	});
};

when.creatingGroupWithOneClosureRouteWithNamePrefix = (as) => {
	when.creatingGroupWithOptionsAndCallback({ as }, (givenRouter) => {
		givenRouter.get('/route-in-group', fakeClosureAction).name('route.in.group');
	});
};

when.creatingGroupWithOneControllerRouteWithActionPrefix = (namespace) => {
	when.creatingGroupWithOptionsAndCallback({ namespace }, (givenRouter) => {
		givenRouter.get('/route-in-group', fakeControllerAction).name('route.in.group');
	});
};

when.addingController = () => {
	when.attempting(() => {
		router.controller('MyController', fakeController);
	});
};

when.addingControllerGroup = () => {
	when.attempting(() => {
		router.controllerGroup('prefix', fakeControllerGroupCallback);
	});
};

when.creatingResourceRouteWithControllerNameWithRestriction = (only) => {
	when.attempting(() => {
		result = router.resource('resource-name', fakeControllerName, only);
	});
};

when.creatingResourceRouteWithControllerName = () => {
	when.creatingResourceRouteWithControllerNameWithRestriction(undefined);
};

when.creatingApiResourceRouteWithControllerNameWithRestriction = (only) => {
	when.attempting(() => {
		result = router.apiResource('resource-name', fakeControllerName, only);
	});
};

when.creatingApiResourceRouteWithControllerName = () => {
	when.creatingApiResourceRouteWithControllerNameWithRestriction(undefined);
};

when.generating = () => {
	when.attempting(() => {
		result = router.generate();
	});
};

when.callingGetRouteHandler = async () => {
	await when.attemptingAsync(async () => {
		result = await router.call('/foo/bar');
	});
};

when.callingGetRouteHandlerByName = () => {
	when.attempting(() => {
		result = router.callByName('fake');
	});
};


//-- Then
//--------------------------------------------------------

then.resultShouldBe = (expected) => {
	then.shouldNotHaveThrown();
	expect(result).toBe(expected);
};

then.resultShouldBeInstanceOf = (expected) => {
	then.shouldNotHaveThrown();
	expect(result).toBeInstanceOf(expected);
};

then.shouldHaveReceivedRoute = () => {
	then.resultShouldBeInstanceOf(Route);
};

then.routeRepositoryShouldHaveReceivedRoute = () => {
	then.shouldNotHaveThrown();
	expect(fakeRouteRepository.add).toHaveBeenCalled();
	expect(fakeRouteRepository.add.mock.calls[0][0]).toBeInstanceOf(Route);
};

then.controllerRepositoryShouldHaveReceivedController = () => {
	then.shouldNotHaveThrown();
};

then.controllerRepositoryShouldHaveReceivedControllerGroup = () => {
	then.shouldNotHaveThrown();
};

then.shouldHaveReceivedRouteWithActionForMethodAndPath = (actionValue, method, path) => {
	then.shouldHaveReceivedRoute();
	expect(result.action).toBe(actionValue);
	expect(result.method).toBe(method);
	expect(result.compilePath().compiledPath).toBe(path);
};

then.shouldHaveReceivedRouteWithClosureActionForMethodAndPath = (method, path) => {
	then.shouldHaveReceivedRouteWithActionForMethodAndPath(fakeClosureAction, method, path);
};

then.shouldHaveReceivedRouteWithControllerActionForMethodAndPath = (method, path) => {
	then.shouldHaveReceivedRouteWithActionForMethodAndPath(fakeControllerAction, method, path);
};

then.shouldHaveReceivedRouteWithRedirectControllerActionForMethodAndPath = (method, path) => {
	then.shouldHaveReceivedRouteWithActionForMethodAndPath('core.RedirectController@handle', method, path);
};

then.shouldHaveReceivedRouteWithStaticControllerActionForMethodAndPath = (method, path) => {
	then.shouldHaveReceivedRouteWithActionForMethodAndPath('core.StaticController@handle', method, path);
};

then.actionShouldReceive = (key, value) => {
	then.shouldHaveReceivedRoute();
	expect(result.defaults).toMatchObject({ [key]: value });
};

then.routeShouldHaveConstraint = (key, value) => {
	then.shouldHaveReceivedRoute();
	expect(result.constraints).toMatchObject({ [key]: value });
};

then.shouldHaveReceivedRouteWithClosureAction = () => {
	then.shouldHaveReceivedRoute();
	expect(result.action).toBe(fakeClosureAction);
};

then.shouldHaveReceivedRouteWithControllerAction = () => {
	then.shouldHaveReceivedRoute();
	expect(result.action).toBe(fakeControllerAction);
};

then.routeCompiledPathShouldStartWith = (prefix) => {
	then.routeRepositoryShouldHaveReceivedRoute();
	expect(fakeRouteRepository.add.mock.calls[0][0].compilePath().compiledPath).toMatch(new RegExp(`^${prefix}`, 'u'));
};

then.routeNameShouldStartWith = (prefix) => {
	then.routeRepositoryShouldHaveReceivedRoute();
	expect(fakeRouteRepository.add.mock.calls[0][0].as).toMatch(new RegExp(`^${prefix}`, 'u'));
};

then.routeActionShouldStartWith = (prefix) => {
	then.routeRepositoryShouldHaveReceivedRoute();
	expect(fakeRouteRepository.add.mock.calls[0][0].action).toMatch(new RegExp(`^${prefix}`, 'u'));
};

then.routeRepositoryShouldHaveReceivedResourceRoutesWithControllerResourceActionsExcept = (except) => {
	then.shouldNotHaveThrown();
	const routes = fakeRouteRepository.add.mock.calls.map(([route]) => { return route; });
	const only = ['index', 'create', 'store', 'show', 'edit', 'update', 'destroy'].filter((method) => {
		return !except.includes(method);
	});
	const wasBuiltClosure = (method) => {
		return routes.some(({ action: resourceAction }) => {
			return resourceAction.endsWith(method);
		});
	};
	const allOnlyWereBuilt = only.every(wasBuiltClosure);
	const atLeastOneExceptWasBuild = except.some(wasBuiltClosure);

	expect(allOnlyWereBuilt).toBe(true);
	expect(atLeastOneExceptWasBuild).toBe(false);
};

then.expressRouterShouldHaveBeenGeneratedWithGetRouteAndOtherGetRoute = () => {
	then.shouldNotHaveThrown();
	expect(fakeRouter.get).toHaveBeenCalledTimes(2);
	expect(fakeRouter.get.mock.calls[0][0]).toBe('/foo/bar');
	expect(fakeRouter.get.mock.calls[1][0]).toBe('/baz/qux');
};

then.getRouteHandlerShouldHaveBeenCalled = () => {
	then.shouldNotHaveThrown();
	expect(fakeExpress.runMiddleware).toHaveBeenCalledTimes(1);
	expect(fakeExpress.runMiddleware).toHaveBeenCalledWith('/foo/bar', { method: 'get' }, fakeInternalCallResultHandler);
};


module.exports = build({ given, when, then });
