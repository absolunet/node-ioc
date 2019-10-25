//--------------------------------------------------------
//-- Tests - Unit - Security - Security Service Provider - GWT
//--------------------------------------------------------

import gwt from './common.gwt';
const { given, when, then, build } = gwt;


//-- Then
//--------------------------------------------------------

then.gateServiceShouldBeResolvable = () => {
	then.serviceShouldBeResolvable('gate');
};

then.gateServiceShouldBeSingleton = () => {
	then.shouldHaveSingleton('gate');
};


export default build({ given, when, then });
