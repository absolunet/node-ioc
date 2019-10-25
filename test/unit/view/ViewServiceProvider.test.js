//--------------------------------------------------------
//-- Tests - Unit - View - View Service Provider - GWT
//--------------------------------------------------------

import gwt from './ViewServiceProvider.gwt';
const { given, when, then } = gwt;


beforeEach(() => {
	given.providersAndDependencies();
});


test('Engine service is resolvable', () => {
	when.bootingContainer();
	then.engineServiceShouldBeResolvable();
});

test('Engine service is a singleton', () => {
	when.bootingContainer();
	then.engineServiceShouldBeSingleton();
});

test('Factory service is resolvable', () => {
	when.bootingContainer();
	then.factoryServiceShouldBeResolvable();
});

test('Factory service is a singleton', () => {
	when.bootingContainer();
	then.factoryServiceShouldBeSingleton();
});

test('Resolver service is resolvable', () => {
	when.bootingContainer();
	then.resolverServiceShouldBeResolvable();
});

test('Resolver service is a singleton', () => {
	when.bootingContainer();
	then.resolverServiceShouldBeSingleton();
});
