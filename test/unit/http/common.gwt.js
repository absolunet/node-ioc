//--------------------------------------------------------
//-- Tests - Unit - HTTP - GWT
//--------------------------------------------------------
'use strict';

const { given, when, then, build } = require('../common.gwt');

const container              = require('../container');
const HttpServiceProvider    = require('../../../lib/http/HttpServiceProvider');
const RoutingServiceProvider = require('../../../lib/routing/RoutingServiceProvider');


//-- Given
//--------------------------------------------------------

given.providersAndDependencies = () => {
	container.register(HttpServiceProvider);
	container.register(RoutingServiceProvider);
};

given.bootedContainer = () => {
	container.bootIfNotBooted();
};


//-- When
//--------------------------------------------------------

when.bootingContainer = () => {
	container.bootIfNotBooted();
};


//-- Then
//--------------------------------------------------------

then.serviceShouldBeResolvable = (service) => {
	expect(container.isBound(service)).toBe(true);
	expect(container.make(service)).toBeTruthy();
};

then.shouldHaveSingleton = (service) => {
	then.serviceShouldBeResolvable(service);
	const instance = container.make(service);
	expect(container.make(service)).toBe(instance);
};


module.exports = build({ given, when, then });
