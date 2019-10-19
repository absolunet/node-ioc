//--------------------------------------------------------
//-- Tests - Unit - Log - Log Service Provider - GWT
//--------------------------------------------------------

import gwt from './common.gwt';
const { given, when, then, build } = gwt;


//-- Then
//--------------------------------------------------------

then.loggerServiceShouldBeResolvable = () => {
	then.serviceShouldBeResolvable('log');
};

then.loggerServiceShouldBeSingleton = () => {
	then.shouldHaveSingleton('log');
};


export default build({ given, when, then });
