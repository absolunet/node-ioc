//--------------------------------------------------------
//-- Tests - Unit - Support - Proxies - Forward Proxy
//--------------------------------------------------------

import gwt from './ForwardProxy.gwt';
import common from './common';


const { given, when, then } = gwt;


beforeEach(() => {
	given.forwardProxy();
	given.forwardObject();
});


describe('Forward proxy', () => {
	common({ given, when, then });


	test('Can forward property from forward object', () => {
		when.gettingForwardedProperty();
		then.shouldHaveReceivedForwardedProperty();
	});

	test('Can forward function from forward object', () => {
		when.gettingForwardedFunction();
		then.shouldHaveReceivedBoundFunctionFromForwardObject();
		then.shouldBeSameFunctionFromForwardObjectUnderneath();
	});

	test('Can forward prototype-less functuon from forward object', () => {
		when.gettingForwardedPrototypeLessFunction();
		then.shouldHaveReceivedBoundPrototypeLessFunctionFromForwardObject();
		then.shouldBeSamePrototypeLessFunctionFromForwardObjectUnderneath();
	});

});
