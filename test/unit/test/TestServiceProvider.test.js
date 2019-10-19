//--------------------------------------------------------
//-- Tests - Unit - Test - Test Service Provider
//--------------------------------------------------------

import gwt from './TestServiceProvider.gwt';
const { given, when, then } = gwt;


beforeEach(() => {
	given.providersAndDependencies();
});


test('Test repository should be resolvable', () => {
	when.bootingContainer();
	then.testRepositoryShouldBeResolvable();
});

test('Test repository should be a singleton', () => {
	when.bootingContainer();
	then.testRepositoryShouldBeSingleton();
});

test('Unit test repository should be resolvable', () => {
	when.bootingContainer();
	then.unitTestRepositoryShouldBeResolvable();
});

test('Unit test repository should be a singleton', () => {
	when.bootingContainer();
	then.unitTestRepositoryShouldBeSingleton();
});

test('Feature test repository should be resolvable', () => {
	when.bootingContainer();
	then.featureTestRepositoryShouldBeResolvable();
});

test('Feature test repository should be a singleton', () => {
	when.bootingContainer();
	then.featureTestRepositoryShouldBeSingleton();
});

test('End-To-End test repository should be resolvable', () => {
	when.bootingContainer();
	then.endToEndTestRepositoryShouldBeResolvable();
});

test('End-To-End test repository should be a singleton', () => {
	when.bootingContainer();
	then.endToEndTestRepositoryShouldBeSingleton();
});

test('Integration test repository should be resolvable', () => {
	when.bootingContainer();
	then.integrationTestRepositoryShouldBeResolvable();
});

test('Integration test repository should be a singleton', () => {
	when.bootingContainer();
	then.integrationTestRepositoryShouldBeSingleton();
});

test('Test runner service should be resolvable', () => {
	when.bootingContainer();
	then.testRunnerShouldBeResolvable();
});

test('Test runner service should be a singleton', () => {
	when.bootingContainer();
	then.testRunnerShouldBeSingleton();
});

test('Tester service should be resolvable', () => {
	when.bootingContainer();
	then.testServiceShouldBeResolvable();
});

test('Tester service should be a singleton', () => {
	when.bootingContainer();
	then.testServiceShouldBeSingleton();
});

test('Test type enum should be resolvable', () => {
	when.bootingContainer();
	then.testTypeEnumShouldBeResolvable();
});

test('Test type enum should be a singleton', () => {
	when.bootingContainer();
	then.testTypeEnumShouldBeSingleton();
});

test('Jest test engine should be resolvable', () => {
	when.bootingContainer();
	then.jestTestEngineShouldBeResolvable();
});

test('Jest test engine should be a singleton', () => {
	when.bootingContainer();
	then.jestTestEngineShouldBeSingleton();
});

test('Test repositories should have the same tag', () => {
	when.bootingContainer();
	then.testRepositoriesShouldHaveSameTag();
});
