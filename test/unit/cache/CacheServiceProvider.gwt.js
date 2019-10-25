//--------------------------------------------------------
//-- Tests - Unit - Cache - Cache Service Provider - GWT
//--------------------------------------------------------

import gwt from './common.gwt';
const { given, when, then, build } = gwt;


//-- Then
//--------------------------------------------------------

then.cacheManagerShouldBeResolvable = () => {
	then.serviceShouldBeResolvable('cache');
};

then.cacheManagerShouldBeSingleton = () => {
	then.shouldHaveSingleton('cache');
};


export default build({ given, when, then });
