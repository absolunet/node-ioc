//--------------------------------------------------------
//-- Tests - Unit - Container
//--------------------------------------------------------

import gwt from './Container.gwt';
const { given, when, then } = gwt;


beforeEach(() => {
	given.emptyResult();
	given.freshContainer();
	given.freshMocks();
	given.context(undefined);
});


describe('Static', () => {

	test('Can manually instantiate container', () => {
		when.gettingNewContainer();
		then.shouldHaveContainer();
	});

	test('Can make new container', () => {
		when.makingContainer();
		then.shouldHaveContainer();
	});

	test('Can get container instance', () => {
		when.gettingContainerInstance();
		then.shouldHaveContainer();
	});

	test('Container instance is a singleton', () => {
		given.containerInstance();
		when.gettingContainerInstance();
		then.resultShouldBeCurrentContainer();
	});

});


describe('Instance', () => {

	beforeEach(() => {
		given.containerInstance();
	});


	test('Can add callback binding', () => {
		given.callbackBinding('foo');
		when.making('foo');
		then.resultShouldBeCallbackResult();
	});

	test('Can add constructor binding', () => {
		given.constructorBinding('foo');
		when.making('foo');
		then.resultShouldBeConstructorInstance();
		then.shouldNotBeBinding('foo');
		then.shouldEqualBinding('foo');
	});

	test('Can add concrete binding', () => {
		given.concreteBinding('foo');
		when.making('foo');
		then.resultShouldBeConcrete();
		then.shouldBeBinding('foo');
	});

	test('Can get binding from proxy', () => {
		given.concreteBinding('foo');
		when.gettingProperty('foo');
		then.resultShouldBeConcrete();
	});

	test('Throws when binding cannot be resolved', () => {
		given.concreteBinding('foo');
		when.making('bar');
		then.shouldHaveThrown();
	});

	test('Can get binding with dotted-syntax name from proxy', () => {
		given.concreteBinding('foo.bar');
		when.gettingProperty('foo.bar');
		then.resultShouldBeConcrete();
	});

	test('Can add callback singleton', () => {
		given.callbackSingleton('foo');
		when.making('foo');
		then.resultShouldBeCallbackResult();
		then.shouldBeBinding('foo');
	});

	test('Can add constructor singleton', () => {
		given.constructorSingleton('foo');
		when.making('foo');
		then.resultShouldBeConstructorInstance();
		then.shouldBeBinding('foo');
	});

	test('Can add contextual binding to callback binding', () => {
		given.callbackBinding('foo');
		given.context({ bar: 'baz' });
		when.making('foo');
		then.callbackShouldHaveReceivedContainerAndContext();
	});

	test('Can add contextual binding to constructor binding', () => {
		given.constructorBinding('foo');
		given.context({ bar: 'baz' });
		when.making('foo');
		then.resultShouldHaveProperty('bar', 'baz');
	});

	test('Can add contextual binding to concrete binding', () => {
		given.concreteBinding('foo');
		given.context({ bar: 'baz' });
		when.making('foo');
		then.resultShouldHaveProperty('bar', 'baz');
	});

	test('Can use tags', () => {
		given.concreteBinding('foo');
		given.constructorBinding('bar');
		when.tagging('foo', 'tag');
		when.tagging('bar', 'tag');
		when.making('tag');
		then.resultShouldBeObject();
		then.resultShouldContainConcreteOnKey('foo');
		then.resultShouldContainConstructorInstanceOnKey('bar');
	});

	test('Can use tags on multiple bindings at once', () => {
		given.concreteBinding('foo');
		given.constructorBinding('bar');
		when.tagging(['foo', 'bar'], 'tag');
		when.making('tag');
		then.resultShouldBeObject();
		then.resultShouldContainConcreteOnKey('foo');
		then.resultShouldContainConstructorInstanceOnKey('bar');
	});

	test('Can auto-wire any class', () => {
		given.concreteBinding('foo');
		when.makingConstructorRequiringFoo();
		then.resultShouldBeConstructorRequiringFooInstance();
	});

	test('Can modify instance before returning it', () => {
		given.concreteBinding('foo');
		given.decoratorModifying('foo');
		when.making('foo');
		then.resultShouldBeModifiedByDecorator();
	});

	test('Can decorate instance before returning it', () => {
		given.concreteBinding('foo');
		given.decoratorReplacing('foo');
		when.making('foo');
		then.resultShouldNotBeConcrete();
		then.resultShouldBeValueReturnedByDecorator();
	});

	test('Dependency is automatically assign as read-only property', () => {
		given.constructorBinding('foo');
		given.context({ bar: 'baz' });
		when.making('foo');
		then.resultShouldHaveProperty('bar', 'baz');
	});

	test('Dependency property name is dotted-syntax compliant', () => {
		given.constructorBinding('foo');
		given.context({ 'bar.baz': 'test' });
		when.making('foo');
		then.resultShouldHaveProperty('barBaz', 'test');
	});

	test('The binding "app" is resolved as container', () => {
		when.making('app');
		then.resultShouldBeContainerInstance();
	});

	test('Can resolve dependency through property of "app"', () => {
		given.concreteBinding('foo');
		when.making('app');
		when.gettingResultProperty('foo');
		then.resultShouldBeConcrete();
	});

	test('Can resolve self through property of "app"', () => {
		when.making('app');
		when.gettingResultProperty('app');
		when.gettingResultProperty('app');
		when.gettingResultProperty('app');
		then.resultShouldBeContainerInstance();
	});

});
