//--------------------------------------------------------
//-- Tests - Unit - File - Services - File Engine - GWT
//--------------------------------------------------------
'use strict';

const { given, when, then, build } = require('../common.gwt');

const container  = require('../../container');
const FileEngine = require('../../../../lib/file/services/FileEngine');

let fileEngine;
let result;


//-- Mocks
//--------------------------------------------------------

const fakeAsync = { scandir: jest.fn() };
const fakeSync  = { scandir: jest.fn() };


//-- Given
//--------------------------------------------------------

given.emptyResult = () => {
	result = undefined;
};

given.fakeAsync = () => {
	container.singleton('file.system.async', fakeAsync);
};

given.fakeSync = () => {
	container.singleton('file.system.sync', fakeSync);
};

given.fileEngine = () => {
	fileEngine = container.make(FileEngine);
};


//-- When
//--------------------------------------------------------

when.gettingAsync = () => {
	when.attempting(() => {
		result = fileEngine.async;
	});
};

when.gettingSync = () => {
	result = fileEngine.sync;
};

when.callingScandir = () => {
	result = fileEngine.scandir('foo', 'bar');
};


//-- Then
//--------------------------------------------------------

then.resultShouldBe = (expected) => {
	then.shouldNotHaveThrown();
	expect(result).toBe(expected);
};

then.shouldHaveAsyncSystem = () => {
	then.resultShouldBe(fakeAsync);
};

then.shouldHaveSyncSystem = () => {
	then.resultShouldBe(fakeSync);
};

then.scandirShouldHaveBeenCalledOnSyncSystem = () => {
	then.shouldNotHaveThrown();
	expect(fakeSync.scandir).toHaveBeenCalledWith('foo', 'bar');
};

then.scandirShouldNotHaveBeenCalledOnAsyncSystem = () => {
	then.shouldNotHaveThrown();
	expect(fakeAsync.scandir).not.toHaveBeenCalled();
};


module.exports = build({ given, when, then });
