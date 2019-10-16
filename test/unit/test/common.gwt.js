//--------------------------------------------------------
//-- Tests - Unit - Test - GWT
//--------------------------------------------------------
'use strict';

const { given, when, then, build } = require('../common.gwt');

const container           = require('../container');
const TestServiceProvider = require('../../../dist/node/test/TestServiceProvider');



//-- Given
//--------------------------------------------------------

given.providersAndDependencies = () => {
	container.register(TestServiceProvider);
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
