//--------------------------------------------------------
//-- Tests - Unit - Support - Support Service Provider
//--------------------------------------------------------
'use strict';

const { given, when, then } = require('./SupportServiceProvider.gwt');


beforeEach(() => {
	given.providersAndDependencies();
});


test('Date helper is resolvable', () => {
	when.bootingContainer();
	then.dateHelperShouldBeResolvable();
});

test('File helper is resolvable', () => {
	when.bootingContainer();
	then.fileHelperShouldBeResolvable();
});

test('String helper is resolvable', () => {
	when.bootingContainer();
	then.stringHelperShouldBeResolvable();
});

test('Caker service is resolvable', () => {
	when.bootingContainer();
	then.fakerShouldBeResolvable();
});

test('Caker service is a singleton', () => {
	when.bootingContainer();
	then.fakerShouldBeSingleton();
});
