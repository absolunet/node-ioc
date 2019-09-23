//--------------------------------------------------------
//-- Tests - Unit - Config - Config Service Provider
//--------------------------------------------------------
'use strict';

const { given, when, then } = require('./ConfigServiceProvider.gwt');


beforeEach(() => {
	given.providersAndDependencies();
	given.emptyConfig();
	given.freshFakeServiceProviders();
});


test('Config repository is resolvable', () => {
	when.bootingContainer();
	then.configRepositoryShouldBeResolvable();
});

test('Config repository is a singleton', () => {
	when.bootingContainer();
	then.configRepositoryShouldBeSingleton();
});

test('Environment repository is resolvable', () => {
	when.bootingContainer();
	then.environmentRepositoryShouldBeResolvable();
});

test('Environment repository is a singleton', () => {
	when.bootingContainer();
	then.environmentRepositoryShouldBeSingleton();
});

test('Config grammar service is resolvable', () => {
	when.bootingContainer();
	then.configGrammarServiceShouldBeResolvable();
});

test('Config grammar service is a singleton', () => {
	when.bootingContainer();
	then.configGrammarServiceShouldBeSingleton();
});

test('Evaluator service is resolvable', () => {
	when.bootingContainer();
	then.evaluatorServiceShouldBeResolvable();
});

test('Evaluator service is a singleton', () => {
	when.bootingContainer();
	then.evaluatorServiceShouldBeSingleton();
});

test('Configured providers are registered when registering config service provider', () => {
	given.configRepositoryDecorator();
	given.fakeBasePath();
	given.fakeConfigWithOneConfiguredServiceProvider();
	given.fakeRegisterOnFakeServiceProviders();
	when.bootingContainer();
	then.configuredServiceProvidersShouldBeBooted();
});
