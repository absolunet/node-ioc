//--------------------------------------------------------
//-- Tests - Unit - HTTP - Repositories - Route Repository
//--------------------------------------------------------
'use strict';

const { given, when, then } = require('./RouteRepository.gwt');


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
	given.emptyResult();
	given.routeRepository();
});


test('Can add route model', () => {
	when.addingGetRoute();
	then.shouldHaveOneRoute();
});

test('Can get all route models', () => {
	given.getRoute();
	given.postRoute();
	when.gettingAllRoutes();
	then.shouldHaveReceivedTwoRoutes();
	then.firstRouteShouldBeGetRoute();
	then.secondRouteShouldBePostRoute();
	then.allRoutesShouldNotBeSingleton();
});

test('Can find route by name', () => {
	given.getRouteWithName();
	when.gettingRouteByName();
	then.shouldHaveReceivedGetRouteWithName();
});

test('Can find routes by path and retrieve all matching routes', () => {
	given.getRoute();
	given.postRoute();
	given.otherRoute();
	when.gettingRouteByPath();
	then.shouldHaveReceivedTwoRoutes();
	then.firstRouteShouldBeGetRoute();
	then.secondRouteShouldBePostRoute();
});

test('Can find routes by path when routes contain parameters', () => {
	given.getRoute();
	given.getRouteWithParameter();
	given.otherRouteWithParameter();
	when.gettingRouteByPath();
	then.shouldHaveReceivedTwoRoutes();
	then.firstRouteShouldBeGetRoute();
	then.secondRouteShouldBeGetRouteWithParameter();
});

test('Can find route by path and HTTP method', () => {
	given.getRoute();
	given.postRoute();
	when.gettingGetRouteByPath();
	then.shouldHaveReceivedGetRoute();
});

test('Can find route by path and HTTP method when routes contain parameters', () => {
	given.getRouteWithParameter();
	when.gettingGetRouteByPath();
	then.shouldHaveReceivedGetRouteWithParameter();
});
