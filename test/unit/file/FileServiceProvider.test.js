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

test('Async file system is resolvable', () => {
	when.bootingContainer();
	then.asyncFileSystemShouldBeResolvable();
});

test('Async file system is a singleton', () => {
	when.bootingContainer();
	then.asyncFileSystemShouldBeSingleton();
});

test('Sync file system is resolvable', () => {
	when.bootingContainer();
	then.syncFileSystemShouldBeResolvable();
});

test('Sync file system is a singleton', () => {
	when.bootingContainer();
	then.syncFileSystemShouldBeSingleton();
});
