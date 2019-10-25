//--------------------------------------------------------
//-- Tests - Unit - Events - Event Service Provider - GWT
//--------------------------------------------------------

import gwt from './common.gwt';
const { given, when, then, build } = gwt;


//-- Then
//--------------------------------------------------------

then.eventServiceShouldBeResolvable = () => {
	then.serviceShouldBeResolvable('event');
};

then.eventServiceShouldBeSingleton = () => {
	then.shouldHaveSingleton('event');
};


export default build({ given, when, then });
