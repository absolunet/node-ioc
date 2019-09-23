//--------------------------------------------------------
//-- Tests - Unit - Cache - GWT
//--------------------------------------------------------
'use strict';

const { given, when, then, build } = require('../common.gwt');

const container = require('../container');

const CacheServiceProvider    = require('../../../lib/cache/CacheServiceProvider');
const DatabaseServiceProvider = require('../../../lib/database/DatabaseServiceProvider');
const SecurityServiceProvider = require('../../../lib/security/SecurityServiceProvider');


//-- Given
//--------------------------------------------------------

given.providersAndDependencies = () => {
	container.register(CacheServiceProvider);
	container.register(DatabaseServiceProvider);
	container.register(SecurityServiceProvider);
};

given.bootedContainer = () => {
	container.bootIfNotBooted();
};

given.config = (key, value) => {
	container.make('config').set(key, value);
};

given.defaultStoreConfig = (name) => {
	given.config('cache.default', name);
};

given.storeConfig = (name, config) => {
	given.config(`cache.stores.${name}`, config);
};

given.prefixConfig = (prefix) => {
	given.config('cache.common.prefix', prefix);
};

given.expirationConfig = (expiration) => {
	given.config('cache.common.expiration', expiration);
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
