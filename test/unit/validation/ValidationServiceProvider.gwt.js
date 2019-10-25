//--------------------------------------------------------
//-- Tests - Unit - Validation - Validation Service Provider - GWT
//--------------------------------------------------------

import gwt from './common.gwt';
const { given, when, then, build } = gwt;


//-- Then
//--------------------------------------------------------

then.validatorServiceIsResolvable = () => {
	then.serviceShouldBeResolvable('validator');
};

then.validatorServiceShouldBeSingleton = () => {
	then.shouldHaveSingleton('validator');
};


export default build({ given, when, then });
