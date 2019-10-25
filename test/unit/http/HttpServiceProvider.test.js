//--------------------------------------------------------
//-- Tests - Unit - HTTP - HTTP Service Provider
//--------------------------------------------------------

import gwt from './HttpServiceProvider.gwt';
const { given, when, then } = gwt;


beforeEach(() => {
	given.providersAndDependencies();
});


test('HTTP client is resolvable', () => {
	when.bootingContainer();
	then.httpClientShouldBeResolvable();
});

test('HTTP service is a singleton', () => {
	when.bootingContainer();
	then.httpClientShouldBeSingleton();
});

test('HTTP server is resolvable', () => {
	when.bootingContainer();
	then.httpServerShouldBeResolvable();
});

test('HTTP server is a singleton', () => {
	when.bootingContainer();
	then.httpServerShouldBeSingleton();
});

test('Handler service is resolvable', () => {
	when.bootingContainer();
	then.handlerServiceShouldBeResolvable();
});

test('Handler service is a singleton', () => {
	when.bootingContainer();
	then.handlerServiceShouldBeSingleton();
});

test('Router service is resolvable', () => {
	when.bootingContainer();
	then.routerServiceShouldBeResolvable();
});

test('Router service is a singleton', () => {
	when.bootingContainer();
	then.routerServiceShouldBeSingleton();
});

test('Controller repository is resolvable', () => {
	when.bootingContainer();
	then.controllerRepositoryShouldBeResolvable();
});

test('Controller repository is a singleton', () => {
	when.bootingContainer();
	then.controllerRepositoryShouldBeSingleton();
});

test('Route repository is resolvable', () => {
	when.bootingContainer();
	then.routeRepositoryShouldBeResolvable();
});

test('Route repository is a singleton', () => {
	when.bootingContainer();
	then.routeRepositoryShouldBeSingleton();
});

test('Redirect controller should be registered', () => {
	given.fakeControllerRepository();
	when.bootingContainer();
	then.redirectControllerShouldBeRegistered();
});

test('Static controller should be registered', () => {
	given.fakeControllerRepository();
	when.bootingContainer();
	then.staticControllerShouldBeRegistered();
});
