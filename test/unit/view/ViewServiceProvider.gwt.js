//--------------------------------------------------------
//-- Tests - Unit - View - View Service Provider - GWT
//--------------------------------------------------------

import gwt from './common.gwt';
const { given, when, then, build } = gwt;


then.engineServiceShouldBeResolvable = () => {
	then.serviceShouldBeResolvable('view.engine');
};

then.factoryServiceShouldBeResolvable = () => {
	then.serviceShouldBeResolvable('view');
};

then.resolverServiceShouldBeResolvable = () => {
	then.serviceShouldBeResolvable('view.resolver');
};

then.engineServiceShouldBeSingleton = () => {
	then.shouldHaveSingleton('view.engine');
};

then.factoryServiceShouldBeSingleton = () => {
	then.shouldHaveSingleton('view');
};

then.resolverServiceShouldBeSingleton = () => {
	then.shouldHaveSingleton('view.resolver');
};


export default build({ given, when, then });
