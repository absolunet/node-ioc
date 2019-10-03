//--------------------------------------------------------
//-- Tests - Unit - Container - GWT
//--------------------------------------------------------
'use strict';

const { given, when, then, build } = require('../common.gwt');

const Container = require('../../../lib/container/Container');

let container;
let result;
let context;

let callbackBinding;
let ConstructorBinding;
let ConstructorRequiringFoo;
let concreteBinding;
let decoratorModifying;
let decoratorReplacing;


//-- Given
//--------------------------------------------------------

given.freshContainer = () => {
	container = undefined;
	delete Container.instance;
};

given.emptyResult = () => {
	result = undefined;
};

given.freshMocks = () => {
	callbackBinding         = jest.fn(() => { return {}; });
	ConstructorBinding      = class {};
	ConstructorRequiringFoo = class {

		static get dependencies() { return ['foo']; }

	};
	concreteBinding         = {};
	decoratorModifying      = jest.fn((concrete) => {
		concrete.decoratedProperty = 'decorated value';

		return concrete;
	});
	decoratorReplacing      = jest.fn((concrete) => { return { decorating: concrete }; });
};

given.containerInstance = () => {
	container = Container.getInstance();
};

given.binding = (abstract, concrete) => {
	container.bind(abstract, concrete);
};

given.singleton = (abstract, concrete) => {
	container.singleton(abstract, concrete);
};

given.callbackBinding = (abstract) => {
	given.binding(abstract, (...parameters) => {
		return callbackBinding(...parameters);
	});
};

given.constructorBinding = (abstract) => {
	given.binding(abstract, ConstructorBinding);
};

given.concreteBinding = (abstract) => {
	given.binding(abstract, concreteBinding);
};

given.callbackSingleton = (abstract) => {
	given.singleton(abstract, callbackBinding);
};

given.constructorSingleton = (abstract) => {
	given.singleton(abstract, ConstructorBinding);
};

given.decorator = (abstract, decorator) => {
	container.decorate(abstract, decorator);
};

given.decoratorModifying = (abstract) => {
	given.decorator(abstract, decoratorModifying);
};

given.decoratorReplacing = (abstract) => {
	given.decorator(abstract, decoratorReplacing);
};

given.context = (values) => {
	context = values;
};


//-- When
//--------------------------------------------------------

when.gettingNewContainer = () => {
	when.attempting(() => {
		result = new Container();
	});
};

when.makingContainer = () => {
	when.attempting(() => {
		result = Container.make();
	});
};

when.gettingContainerInstance = () => {
	when.attempting(() => {
		result = Container.getInstance();
	});
};

when.making = (abstract) => {
	when.attempting(() => {
		result = container.make(abstract, context);
	});
};

when.makingCallback = () => {
	when.making(callbackBinding);
};

when.makingConstructor = () => {
	when.making(ConstructorBinding);
};

when.makingConcrete = () => {
	when.making(concreteBinding);
};

when.makingConstructorRequiringFoo = () => {
	when.making(ConstructorRequiringFoo);
};

when.gettingProperty = (property) => {
	when.attempting(() => {
		result = container[property];
	});
};

when.tagging = (abstracts, tag) => {
	when.attempting(() => {
		container.tag(abstracts, tag);
	});
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

then.resultShouldBeInstanceOf = (constructor) => {
	then.shouldNotHaveThrown();
	expect(result).toBeInstanceOf(constructor);
};

then.shouldHaveContainer = () => {
	then.resultShouldBeInstanceOf(Container);
};

then.resultShouldBeCurrentContainer = () => {
	then.resultShouldBe(container);
};

then.resultShouldBeCallbackResult = () => {
	then.resultShouldBe(callbackBinding.mock.results[0].value);
};

then.resultShouldBeConstructorInstance = () => {
	then.resultShouldBeInstanceOf(ConstructorBinding);
};

then.resultShouldBeConcrete = () => {
	then.resultShouldBe(concreteBinding);
};

then.shouldBeBinding = (abstract) => {
	then.resultShouldBe(container.make(abstract));
};

then.shouldNotBeBinding = (abstract) => {
	then.resultShouldNotBe(container.make(abstract));
};

then.shouldEqualBinding = (abstract) => {
	then.shouldNotHaveThrown();
	expect(result).toStrictEqual(container.make(abstract));
};

then.callbackShouldHaveReceivedContainerAndContext = () => {
	then.shouldNotHaveThrown();
	expect(callbackBinding).toHaveBeenCalled();
	expect(callbackBinding.mock.calls[0][0]).toBeInstanceOf(Container);
	expect(callbackBinding.mock.calls[0][1]).toBe(context);
};

then.resultShouldHaveProperty = (key, value) => {
	then.shouldNotHaveThrown();
	expect(result).toBeTruthy();
	expect(result[key]).toBe(value);
};

then.resultShouldBeObject = () => {
	then.shouldNotHaveThrown();
	expect(typeof result).toBe('object');
	expect(result).toBeTruthy();
};

then.resultShouldContainConcreteOnKey = (key) => {
	then.resultShouldBeObject();
	expect(result[key]).toBe(concreteBinding);
};

then.resultShouldContainConstructorInstanceOnKey = (key) => {
	then.resultShouldBeObject();
	expect(result[key]).toBeInstanceOf(ConstructorBinding);
};

then.resultShouldBeConstructorRequiringFooInstance = () => {
	then.resultShouldBeInstanceOf(ConstructorRequiringFoo);
};

then.resultShouldBeModifiedByDecorator = () => {
	expect(decoratorModifying).toHaveBeenCalled();
	then.resultShouldHaveProperty('decoratedProperty', 'decorated value');
};

then.resultShouldNotBeConcrete = () => {
	then.resultShouldNotBe(concreteBinding);
};

then.resultShouldBeValueReturnedByDecorator = () => {
	expect(decoratorReplacing).toHaveBeenCalled();
	then.resultShouldBe(decoratorReplacing.mock.results[0].value);
};


module.exports = build({ given, when, then });

