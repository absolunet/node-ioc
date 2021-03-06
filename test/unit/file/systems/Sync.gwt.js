//--------------------------------------------------------
//-- Tests - Unit - File - Systems - Sync - GWT
//--------------------------------------------------------

import gwt from '../common.gwt';
const { given, when, then, build } = gwt;

import fss           from '@absolunet/fss';
import replaceInFile from 'replace-in-file';
import container     from '../../container';
import SyncSystem    from '../../../../dist/node/file/systems/Sync';

let syncSystem;
let file;
let search;
let replace;


//-- Mocks
//--------------------------------------------------------

const fakeScandir       = jest.fn(() => { return []; });
const fakeReplaceInFile = jest.fn();


//-- Given
//--------------------------------------------------------

given.mockedAbsolunetFss = () => {
	Object.defineProperty(fss.constructor.prototype, 'scandir', { value: fakeScandir });
};

given.mockedReplaceInFile = () => {
	jest.spyOn(replaceInFile, 'sync').mockImplementation(fakeReplaceInFile);
};

given.syncSystem = () => {
	syncSystem = container.make(SyncSystem);
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
	search = /search string/im; // eslint-disable-line require-unicode-regexp
};

given.replace = () => {
	replace = 'Replace string';
};


//-- When
//--------------------------------------------------------

when.callingScandir = () => {
	when.attempting(() => {
		syncSystem.scandir(__dirname);
	});
};

when.replacingInFile = () => {
	when.attempting(() => {
		syncSystem.replaceInFile(file, search, replace);
	});
};


//-- Then
//--------------------------------------------------------

then.scandirShouldHaveBeenCalledOnAbsolunetFss = () => {
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


export default build({ given, when, then });
