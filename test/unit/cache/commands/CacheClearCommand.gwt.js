//--------------------------------------------------------
//-- Tests - Unit - Cache - Commands - Cache Clear Command - GWT
//--------------------------------------------------------

import gwt from './common.gwt';
const { given, when, then, build } = gwt;

import CacheClearCommand from '../../../../dist/node/cache/commands/CacheClearCommand';


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
	then.storeShouldHaveBeenFlushed(null);
};

then.alternateStoreShouldHaveBeenFlushed = () => {
	then.storeShouldHaveBeenFlushed('foo');
};


export default build({ given, when, then });
