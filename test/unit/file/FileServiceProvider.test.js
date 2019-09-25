//--------------------------------------------------------
//-- Tests - Unit - File - File Service Provider
//--------------------------------------------------------
'use strict';

const { given, when, then } = require('./FileServiceProvider.gwt');


beforeEach(() => {
	given.providersAndDependencies();
});


test('File manager is resolvable', () => {
	when.bootingContainer();
	then.fileManagerShouldBeResolvable();
});

test('File manager service is a singleton', () => {
	when.bootingContainer();
	then.fileEngineShouldBeSingleton();
});

test('File engine is resolvable', () => {
	when.bootingContainer();
	then.fileManagerShouldBeResolvable();
});

test('File engine service is a singleton', () => {
	when.bootingContainer();
	then.fileEngineShouldBeSingleton();
});

