//--------------------------------------------------------
//-- Tests - Unit - HTTP - Services - Router
//--------------------------------------------------------
'use strict';

const { given, when, then } = require('./Router.gwt');


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
	given.emptyResult();
	given.action(undefined);
	given.path(undefined);
	given.fakeServer();
	given.fakeHandler();
	given.fakeRouteRepository();
	given.fakeControllerRepository();
	given.router();
});


['get', 'post', 'put', 'patch', 'delete', 'any', 'all'].forEach((method) => {

	test(`Can add [${method}] route with a closure action`, () => {
		given.closureAction();
		given.path('/foo/bar');
		when.creatingRouteWithMethod(method === 'any' ? 'all' : method);
		then.shouldHaveReceivedRouteWithClosureActionForMethodAndPath(method === 'any' ? 'all' : method, '/foo/bar');
		then.routeRepositoryShouldHaveReceivedRoute();
		then.shouldHaveReceivedRoute();
	});

	test(`Can add [${method}] route with a controller action`, () => {
		given.controllerAction();
		given.path('/foo/bar');
		when.creatingRouteWithMethod(method === 'any' ? 'all' : method);
		then.shouldHaveReceivedRouteWithControllerActionForMethodAndPath(method === 'any' ? 'all' : method, '/foo/bar');
		then.routeRepositoryShouldHaveReceivedRoute();
		then.shouldHaveReceivedRoute();
	});

});

test('Can add a fallback route with a closure', () => {
	given.closureAction();
	when.creatingFallbackRoute();
	then.shouldHaveReceivedRouteWithClosureActionForMethodAndPath('all', '/*');
	then.routeRepositoryShouldHaveReceivedRoute();
	then.shouldHaveReceivedRoute();
});

test('Can add a fallback route with a controller action', () => {
	given.controllerAction();
	when.creatingFallbackRoute();
	then.shouldHaveReceivedRouteWithControllerActionForMethodAndPath('all', '/*');
	then.routeRepositoryShouldHaveReceivedRoute();
	then.shouldHaveReceivedRoute();
});

test('Can add a redirection within routes', () => {
	when.creatingRedirection('/foo/bar', '/baz/qux');
	then.shouldHaveReceivedRouteWithRedirectControllerActionForMethodAndPath('all', '/foo/bar');
	then.actionShouldReceive('to', '/baz/qux');
	then.actionShouldReceive('permanent', false);
	then.shouldHaveReceivedRoute();
});

test('Can add a permanent redirection within routes', () => {
	when.creatingPermanentRedirection('/foo/bar', '/baz/qux');
	then.shouldHaveReceivedRouteWithRedirectControllerActionForMethodAndPath('all', '/foo/bar');
	then.actionShouldReceive('to', '/baz/qux');
	then.actionShouldReceive('permanent', true);
	then.shouldHaveReceivedRoute();
});

test('Can serve static files from given folder for given path', () => {
	when.creatingStaticRoute('/foo/bar', __dirname);
	then.shouldHaveReceivedRouteWithStaticControllerActionForMethodAndPath('get', '/foo/bar/:file');
	then.actionShouldReceive('path', '/foo/bar');
	then.actionShouldReceive('folder', __dirname);
	then.routeShouldHaveConstraint('file', '*');
	then.shouldHaveReceivedRoute();
});

test('Add a route with method, path and action', () => {
	given.controllerAction();
	when.addingRoute('get', '/foo/bar');
	then.shouldHaveReceivedRouteWithControllerActionForMethodAndPath('get', '/foo/bar');
	then.shouldHaveReceivedRoute();
});

test('Can create route group', () => {
	when.creatingGroupWithOneClosureRoute();
	then.routeRepositoryShouldHaveReceivedRoute();
});

test('Can set prefix to route group', () => {
	when.creatingGroupWithOneClosureRouteWithPrefix('prefix');
	then.routeRepositoryShouldHaveReceivedRoute();
	then.routeCompiledPathShouldStartWith('/prefix');
});

test('Can set name prefix', () => {
	when.creatingGroupWithOneClosureRouteWithNamePrefix('prefix.');
	then.routeRepositoryShouldHaveReceivedRoute();
	then.routeNameShouldStartWith('prefix.');
});

test('Can set action prefix to route group', () => {
	when.creatingGroupWithOneControllerRouteWithActionPrefix('prefix');
	then.routeRepositoryShouldHaveReceivedRoute();
	then.routeActionShouldStartWith('prefix.');
});

test('Can add a controller in controller repository', () => {
	when.addingController();
	then.controllerRepositoryShouldHaveReceivedController();
});

test('Can add a controller group in controller repository', () => {
	when.addingControllerGroup();
	then.controllerRepositoryShouldHaveReceivedControllerGroup();
});

test('Can create resource routes with "index", "create", "store", "show", "edit", "update" and "destroy"', () => {
	when.creatingResourceRouteWithControllerName();
	then.routeRepositoryShouldHaveReceivedResourceRoutesWithControllerResourceActionsExcept([]);
});

test('Can create resource routes with restrictions on wanted routes', () => {
	when.creatingResourceRouteWithControllerNameWithRestriction(['index', 'show']);
	then.routeRepositoryShouldHaveReceivedResourceRoutesWithControllerResourceActionsExcept(['create', 'store', 'edit', 'update', 'destroy']);
});

test('Can create API resource with "index", "store", "show", "update" and "destroy"', () => {
	when.creatingApiResourceRouteWithControllerName();
	then.routeRepositoryShouldHaveReceivedResourceRoutesWithControllerResourceActionsExcept(['create', 'edit']);
});

test('Can create API resource with restriction on wanted routes', () => {
	when.creatingApiResourceRouteWithControllerNameWithRestriction(['index', 'show']);
	then.routeRepositoryShouldHaveReceivedResourceRoutesWithControllerResourceActionsExcept(['create', 'store', 'edit', 'update', 'destroy']);
});

test('Can generate routes through an Express server instance', () => {
	given.getRoute();
	given.otherGetRoute();
	when.generating();
	then.expressRouterShouldHaveBeenGeneratedWithGetRouteAndOtherGetRoute();
});

test('Can call a route handler based on path and method', () => {
	given.getRoute();
	given.otherGetRoute();
	when.callingGetRouteHandler();
	then.expressRouterShouldHaveBeenGeneratedWithGetRouteAndOtherGetRoute();
	then.getRouteHandlerShouldHaveBeenCalled();
});

test('Can call a route handler based on route name', () => {
	given.getRoute();
	given.otherGetRoute();
	when.callingGetRouteHandlerByName();
	then.expressRouterShouldHaveBeenGeneratedWithGetRouteAndOtherGetRoute();
	then.getRouteHandlerShouldHaveBeenCalled();
});
