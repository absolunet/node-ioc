//--------------------------------------------------------
//-- Tests - Unit - Support - Proxies - Forward Proxy - GWT
//--------------------------------------------------------

import gwt from './common.gwt';
import ForwardProxy from '../../../../dist/node/support/proxies/ForwardProxy';


const { given, when, then, build } = gwt;


let forwardInstance;
let spies;


//-- Given
//--------------------------------------------------------

given.forwardProxy = () => {
	given.proxy(ForwardProxy);
};

given.forwardObject = () => {
	spies = {
		'function':              jest.fn(),
		'prototypeLessFunction': jest.fn()
	};

	forwardInstance = {
		forwardedProperty: 'forwarded value',
		forwardedFunction() {
			spies.function(this);
		},
		forwardedPrototypeLessFunction: (() => {
			const prototypeLessFunction = function() {
				spies.prototypeLessFunction(this);
			};

			Object.setPrototypeOf(prototypeLessFunction, null);

			return prototypeLessFunction;
		})()
	};

	given.extraOnProxyInstance({
		getForward() {
			return forwardInstance;
		}
	});
};


//-- When
//--------------------------------------------------------

when.gettingForwardedProperty = () => {
	when.getting('forwardedProperty');
};

when.gettingForwardedFunction = () => {
	when.getting('forwardedFunction');
};

when.gettingForwardedPrototypeLessFunction = () => {
	when.getting('forwardedPrototypeLessFunction');
};


//-- Then
//--------------------------------------------------------

then.shouldHaveReceivedForwardedProperty = () => {
	then.resultShouldBe(forwardInstance.forwardedProperty);
};

then.shouldHaveReceivedBoundFunctionFromForwardObject = () => {
	then.resultShouldNotBe(forwardInstance.forwardedFunction);
	then.resultShouldHaveProperty('name', `bound ${forwardInstance.forwardedFunction.name}`);
};

then.shouldBeSameFunctionFromForwardObjectUnderneath = () => {
	when.executingResult();
	expect(spies.function).toHaveBeenCalledWith(forwardInstance);
};

then.shouldHaveReceivedBoundPrototypeLessFunctionFromForwardObject = () => {
	then.resultShouldNotBe(forwardInstance.forwardedPrototypeLessFunction);
	then.resultShouldHaveProperty('name', `bound ${forwardInstance.forwardedPrototypeLessFunction.name}`);
};

then.shouldBeSamePrototypeLessFunctionFromForwardObjectUnderneath = () => {
	when.executingResult();
	expect(spies.prototypeLessFunction).toHaveBeenCalledWith(forwardInstance);
};


export default build({ given, when, then });
