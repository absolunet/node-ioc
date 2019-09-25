//--------------------------------------------------------
//-- Tests - Unit - HTTP - Services - Router
//--------------------------------------------------------
'use strict';

const { given, when, then } = require('./Router.gwt');


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
});


['get', 'post', 'put', 'patch', 'delete', 'any', 'all'].forEach((method) => {

	test(`Can add [${method}] route with a closure`, () => {

	});

	test(`Can add [${method}] route with a controller action`, () => {

	});

});

test('Can add a fallback route with a closure', () => {

});

test('Can add a fallback route with a controller action', () => {

});

test('Can add a redirection within routes', () => {

});

test('Can add a permanent redirection within routes', () => {

});

test('Can serve static files from given folder for given path', () => {

});

test('Add a route with method, path and action', () => {

});

test('Can create route group', () => {

});

test('Can set prefix to route group', () => {

});

test('Can set name prefix', () => {

});

test('Can set action prefix to route group', () => {

});


test('Can add a controller in controller repository', () => {

});

test('Can add a controller group in controller repository', () => {

});

test('Can create resource routes with "index", "store", "show", "update" and "destroy"', () => {

});

test('Can create resource routes with restrictions on wanted routes', () => {

});

test('Can generate routes through an Express server instance', () => {

});

test('Can call a route handler based on path and method', () => {

});

test('Can call a route handler based on route name', () => {

});
