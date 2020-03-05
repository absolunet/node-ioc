//--------------------------------------------------------
//-- Tests - Unit - Support - Proxies - Base Proxy - Common - GWT
//--------------------------------------------------------

import gwt from '../common.gwt';
const { given, when, then, build } = gwt;


let extra;
let result;
let spies;
let proxy;
let instance;
let proxiedInstance;


//-- Given
//--------------------------------------------------------

given.emptyResult = () => {
	result = undefined;
};

given.proxy = (ProxyHandler) => {
	proxy = new ProxyHandler();
};

given.extraOnProxyInstance = (data) => {
	extra = data;
};

given.proxiedInstance = () => {
	spies = {
		'function':              jest.fn(),
		'prototypeLessFunction': jest.fn()
	};

	instance = {
		'primitive': 'foo',
		'object': {},
		function() {
			spies.function(this);
		},
		'null': null,
		undefined,
		'prototypeLessFunction': (() => {
			const prototypeLessFunction = function() {
				spies.prototypeLessFunction(this);
			};

			Object.setPrototypeOf(prototypeLessFunction, null);

			return prototypeLessFunction;
		})(),
		...extra || {}
	};

	proxiedInstance = new Proxy(instance, proxy);
};


//-- When
//--------------------------------------------------------

when.getting = (property) => {
	when.attempting(() => {
		result = proxiedInstance[property];
	});
};

when.gettingPrimitiveProperty = () => {
	when.getting('primitive');
};

when.gettingObjectProperty = () => {
	when.getting('object');
};

when.gettingFunctionProperty = () => {
	when.getting('function');
};

when.gettingNullProperty = () => {
	when.getting('null');
};

when.gettingUndefinedProperty = () => {
	when.getting('undefined');
};

when.gettingPropertyThatDoesNotExist = () => {
	when.getting('unexisting');
};

when.gettingPrototypeLessFunctionProperty = () => {
	when.getting('prototypeLessFunction');
};

when.executingResult = () => {
	result();
};


//-- Then
//--------------------------------------------------------

then.resultShouldBe = (expected) => {
	then.shouldNotHaveThrown();
	expect(result).toBe(expected);
};

then.resultShouldNotBe = (expected) => {
	then.shouldNotHaveThrown();
	expect(result).not.toBe(expected);
};

then.resultShouldBeTypeOf = (expected) => {
	then.shouldNotHaveThrown();
	expect(typeof result).toBe(expected);
};

then.resultShouldHaveProperty = (...expected) => {
	then.shouldNotHaveThrown();
	expect(result).toHaveProperty(...expected);
};

then.shouldHaveReceivedPrimitiveValue = () => {
	then.resultShouldBe(instance.primitive);
};

then.shouldHaveReceivedObjectValue = () => {
	then.resultShouldBe(instance.object);
};

then.shouldHaveReceivedBoundFunction = () => {
	then.resultShouldNotBe(instance.function);
	then.resultShouldHaveProperty('name', `bound ${instance.function.name}`);
};

then.shouldBeSameFunctionUnderneath = () => {
	when.executingResult();
	expect(spies.function).toHaveBeenCalledWith(instance);
};

then.shouldHaveReceivedNullValue = () => {
	then.resultShouldBe(null);
};

then.shouldHaveReceivedUndefined = () => {
	then.resultShouldBeTypeOf('undefined');
};

then.shouldHaveReceivedBoundPrototypeLessFunction = () => {
	then.resultShouldNotBe(instance.prototypeLessFunction);
	then.resultShouldHaveProperty('name', `bound ${instance.prototypeLessFunction.name}`);
};

then.shouldBeSamePrototypeLessFunctionUnderneath = () => {
	when.executingResult();
	expect(spies.prototypeLessFunction).toHaveBeenCalledWith(instance);
};


export default build({ given, when, then });
