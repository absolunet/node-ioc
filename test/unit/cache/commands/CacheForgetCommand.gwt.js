//--------------------------------------------------------
//-- Tests - Unit - Cache - Commands - Cache Forget Command - GWT
//--------------------------------------------------------

import gwt from './common.gwt';
const { given, when, then, build } = gwt;

import CacheForgetCommand from '../../../../dist/node/cache/commands/CacheForgetCommand';


given.cacheForgetCommand = () => {
	given.command(CacheForgetCommand);
};

given.cacheKeyAsParameter = (key) => {
	given.parameter('key', key);
};


then.shouldHaveDeletedKeyOnStore = (key, store) => {
	then.shouldHaveCalledResolveOnCacheManagerWith(store);
	then.storeShouldHaveDeletedKey(key);
};

then.shouldHaveDeletedKeyOnDefaultStore = (key) => {
	then.shouldHaveDeletedKeyOnStore(key, undefined);
};

then.shouldHaveDeletedKeyOnAlternateStore = (key) => {
	then.shouldHaveDeletedKeyOnStore(key, 'foo');
};


export default build({ given, when, then });
