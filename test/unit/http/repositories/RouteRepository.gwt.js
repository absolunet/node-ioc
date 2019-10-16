//--------------------------------------------------------
//-- Tests - Unit - HTTP - Repositories - Route Repository - GWT
//--------------------------------------------------------
'use strict';

const { given, when, then, build } = require('../common.gwt');

const container       = require('../../container');
const RouteRepository = require('../../../../dist/node/http/repositories/RouteRepository');
const Route           = require('../../../../dist/node/http/Route');

let routeRepository;
let result;


//-- Mocks
//--------------------------------------------------------

const getRoute                = new Route({ path: '/foo/bar',          method: 'get' });
const getRouteWithName        = new Route({ path: '/foo/bar',          method: 'get', as: 'foo.bar' });
const postRoute               = new Route({ path: '/foo/bar',          method: 'post' });
const otherRoute              = new Route({ path: '/other/path',       method: 'get' });
const getRouteWithParameter   = new Route({ path: '/foo/:parameter',   method: 'get' });
const otherRouteWithParameter = new Route({ path: '/other/:parameter', method: 'get' });


//-- Given
//--------------------------------------------------------

given.emptyResult = () => {
	result = undefined;
};

given.routeRepository = () => {
	routeRepository = container.make(RouteRepository);
};

given.getRoute = () => {
	routeRepository.add(getRoute);
};

given.postRoute = () => {
	routeRepository.add(postRoute);
};

given.getRouteWithName = () => {
	routeRepository.add(getRouteWithName);
};

given.otherRoute = () => {
	routeRepository.add(otherRoute);
};

given.getRouteWithParameter = () => {
	routeRepository.add(getRouteWithParameter);
};

given.otherRouteWithParameter = () => {
	routeRepository.add(otherRouteWithParameter);
};


//-- When
//--------------------------------------------------------

when.addingGetRoute = () => {
	when.attempting(() => {
		routeRepository.add(getRoute);
	});
};

when.gettingAllRoutes = () => {
	when.attempting(() => {
		result = routeRepository.all();
	});
};

when.gettingRouteByName = () => {
	when.attempting(() => {
		result = routeRepository.findByName('foo.bar');
	});
};

when.gettingRouteByPath = () => {
	when.attempting(() => {
		result = routeRepository.findByPath('/foo/bar');
	});
};

when.gettingGetRouteByPath = () => {
	when.attempting(() => {
		result = routeRepository.findByPathForMethod('/foo/bar', 'get');
	});
};


//-- Then
//--------------------------------------------------------

then.resultShouldBe = (expected) => {
	then.shouldNotHaveThrown();
	expect(result).toBe(expected);
};

then.shouldHaveOneRoute = () => {
	then.shouldNotHaveThrown();
	expect(routeRepository.all()).toHaveLength(1);
};

then.shouldHaveReceivedTwoRoutes = () => {
	then.shouldNotHaveThrown();
	expect(result).toHaveLength(2);
};

then.firstRouteShouldBeGetRoute = () => {
	then.shouldNotHaveThrown();
	expect(result[0]).toBe(getRoute);
};

then.secondRouteShouldBePostRoute = () => {
	then.shouldNotHaveThrown();
	expect(result[1]).toBe(postRoute);
};

then.secondRouteShouldBeGetRouteWithParameter = () => {
	then.shouldNotHaveThrown();
	expect(result[1]).toBe(getRouteWithParameter);
};

then.allRoutesShouldNotBeSingleton = () => {
	then.shouldNotHaveThrown();
	expect(result).toStrictEqual(routeRepository.all());
	expect(result).not.toBe(routeRepository.all());
};

then.shouldHaveReceivedGetRoute = () => {
	then.resultShouldBe(getRoute);
};

then.shouldHaveReceivedGetRouteWithName = () => {
	then.resultShouldBe(getRouteWithName);
};

then.shouldHaveReceivedGetRouteWithParameter = () => {
	then.resultShouldBe(getRouteWithParameter);
};


module.exports = build({ given, when, then });
