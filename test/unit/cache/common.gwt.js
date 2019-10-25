//--------------------------------------------------------
//-- Tests - Unit - Cache - GWT
//--------------------------------------------------------

import gwt from '../common.gwt';
const { given, when, then, build } = gwt;

import container from '../container';

import CacheServiceProvider    from '../../../dist/node/cache/CacheServiceProvider';
import DatabaseServiceProvider from '../../../dist/node/database/DatabaseServiceProvider';
import SecurityServiceProvider from '../../../dist/node/security/SecurityServiceProvider';


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


export default build({ given, when, then });
