//--------------------------------------------------------
//-- Tests - Unit - Cache - Commands - Cache Clear Command - GWT
//--------------------------------------------------------
'use strict';

const { given, when, then, build } = require('./common.gwt');

const CacheClearCommand = require('../../../../dist/node/cache/commands/CacheClearCommand');


//-- Given
//--------------------------------------------------------

given.cacheClearCommand = () => {
	given.command(CacheClearCommand);
};


//-- Then
//--------------------------------------------------------

then.storeShouldHaveBeenFlushed = (store) => {
	then.shouldHaveCalledResolveOnCacheManagerWith(store);
};

then.defaultStoreShouldHaveBeenFlushed = () => {
	then.storeShouldHaveBeenFlushed(undefined);
};

then.alternateStoreShouldHaveBeenFlushed = () => {
	then.storeShouldHaveBeenFlushed('foo');
};


module.exports = build({ given, when, then });
