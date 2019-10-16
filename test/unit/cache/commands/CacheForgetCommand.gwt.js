//--------------------------------------------------------
//-- Tests - Unit - Cache - Commands - Cache Forget Command - GWT
//--------------------------------------------------------
'use strict';

const { given, when, then, build } = require('./common.gwt');

const CacheForgetCommand = require('../../../../dist/node/cache/commands/CacheForgetCommand');


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

module.exports = build({ given, when, then });
