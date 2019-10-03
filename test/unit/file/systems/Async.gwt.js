//--------------------------------------------------------
//-- Tests - Unit - File - Systems - Async - GWT
//--------------------------------------------------------
'use strict';

const { given, when, then, build } = require('../common.gwt');

const fsp         = require('@absolunet/fsp');
const container   = require('../../container');
const AsyncSystem = require('../../../../lib/file/systems/Async');

let asyncSystem;
let file;
let search;
let replace;
let fakeReplaceInFile;


//-- Mocks
//--------------------------------------------------------

const fakeScandir = jest.fn(() => { return []; });


//-- Given
//--------------------------------------------------------

given.mockedAbsolunetFsp = () => {
	Object.defineProperty(fsp.constructor.prototype, 'scandir', { value: fakeScandir });
};

given.mockedReplaceInFile = () => {
	jest.mock('replace-in-file', () => {
		const value = jest.fn();
		fakeReplaceInFile = value;

		return value;
	});
};

given.asyncSystem = () => {
	asyncSystem = container.make(AsyncSystem);
};

given.file = () => {
	file = '/path/to/file.ext';
};

given.glob = () => {
	file = '/path/**/*.ext';
};

given.searchString = () => {
	search = 'Search string';
};

given.searchPatternWithFlags = () => {
	search = /search string/mi; // eslint-disable-line require-unicode-regexp
};

given.replace = () => {
	replace = 'Replace string';
};


//-- When
//--------------------------------------------------------

when.callingScandir = async () => {
	await when.attemptingAsync(async () => {
		await asyncSystem.scandir(__dirname);
	});
};

when.replacingInFile = async () => {
	await when.attemptingAsync(async () => {
		await asyncSystem.replaceInFile(file, search, replace);
	});
};


//-- Then
//--------------------------------------------------------

then.scandirShouldHaveBeenCalledOnAbsolunetFsp = () => {
	then.shouldNotHaveThrown();
	expect(fakeScandir).toHaveBeenCalledWith(__dirname);
};

then.shouldHaveCalledReplaceInFile = () => {
	then.shouldNotHaveThrown();
	expect(fakeReplaceInFile).toHaveBeenCalledTimes(1);
	const [[call]] = fakeReplaceInFile.mock.calls;
	expect(call.files).toBe(file);
	expect(call.to).toBe(replace);
	expect('Search string').toMatch(call.from);
};

then.searchedPatternShouldContainFlagsAndDefaultOnes = () => {
	then.shouldNotHaveThrown();
	const [[call]] = fakeReplaceInFile.mock.calls;
	expect(typeof call.from).toBe('object');
	const flags = call.from.flags.split('');
	expect(flags).toContain('m');
	expect(flags).toContain('i');
	expect(flags).toContain('u');
	expect(flags).toContain('g');
};


module.exports = build({ given, when, then });
