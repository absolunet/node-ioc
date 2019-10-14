//--------------------------------------------------------
//-- Tests - Unit - Database - GWT
//--------------------------------------------------------
'use strict';

const { given, when, then, build } = require('../common.gwt');

const container               = require('../container');
const DatabaseServiceProvider = require('../../../src/database/DatabaseServiceProvider');


//-- Given
//--------------------------------------------------------

given.providersAndDependencies = () => {
	container.register(DatabaseServiceProvider);
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
