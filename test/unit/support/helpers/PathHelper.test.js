//--------------------------------------------------------
//-- Tests - Unit - Support - Helpers - Path Helper
//--------------------------------------------------------

import gwt from './PathHelper.gwt';
const { given, when, then } = gwt;


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
	given.pathHelper();
	given.emptyResult();
});


test('Can get forward module', () => {
	when.gettingForward();
	then.resultShouldBe(require('path')); // eslint-disable-line global-require
});

test('Can get file base name', () => {
	when.gettingBaseName('/foo/bar/baz.qux');
	then.resultShouldBe('baz.qux');
});

test('Can get file base name without extension', () => {
	when.gettingBaseName('/foo/bar/baz.qux', '.qux');
	then.resultShouldBe('baz');
});

test('Can get directory name', () => {
	when.gettingDirectoryName('/foo/bar/baz.qux');
	then.resultShouldBe('/foo/bar');
});

test('Can get file extension name', () => {
	when.gettingExtensionName('/foo/bar/baz.qux');
	then.resultShouldBe('.qux');
});

test('Can format path from a given path object', () => {
	when.formatting({ dir: '/foo/bar', name: 'baz', ext: '.qux' }); // eslint-disable-line unicorn/prevent-abbreviations
	then.resultShouldBe('/foo/bar/baz.qux');
});

test('Can check if path is absolute', () => {
	when.checkingIfPathIsAbsolute('/foo/bar/baz.qux');
	then.resultShouldBe(true);
});

test('Can check if path is not absolute', () => {
	when.checkingIfPathIsAbsolute('foo/bar/baz.qux');
	then.resultShouldBe(false);
});

test('Can check if path is relative', () => {
	when.checkingIfPathIsRelative('foo/bar/baz.qux');
	then.resultShouldBe(true);
});

test('Can check if path is not relative', () => {
	when.checkingIfPathIsRelative('/foo/bar/baz.qux');
	then.resultShouldBe(false);
});

test('Can normalize a path', () => {
	when.normalizing('/foo/bar/baz/qux/..');
	then.resultShouldBe('/foo/bar/baz');
});

test('Can parse a path', () => {
	when.parsing('/foo/bar/baz.qux');
	then.resultShouldEqual({ root: '/', dir: '/foo/bar', base: 'baz.qux', ext: '.qux', name: 'baz' }); // eslint-disable-line unicorn/prevent-abbreviations
});

test('Can get relative path from one path to another', () => {
	when.gettingRelativePath('/foo', '/foo/bar/baz.qux');
	then.resultShouldBe('bar/baz.qux');
});

test('Can resolve path', () => {
	when.resolvingPath('/foo', '/bar', 'baz.qux');
	then.resultShouldBe('/bar/baz.qux');
});

test('Can replace backslashes by slashes', () => {
	when.replacingSlashes('foo\\bar\\baz.qux');
	then.resultShouldBe('foo/bar/baz.qux');
});

test('Replacing backslashes without any slashes does not affect string', () => {
	when.replacingSlashes('foo/bar/baz.qux');
	then.resultShouldBe('foo/bar/baz.qux');
});

test('Getting directory name converts backslashes to slashes', () => {
	when.gettingDirectoryName('\\foo\\bar\\baz.qux');
	then.resultShouldBe('/foo/bar');
});

test('Formatting path converts backslashes to slashes', () => {
	when.formatting({ dir: '\\foo\\bar', name: 'baz', ext: '.qux' }); // eslint-disable-line unicorn/prevent-abbreviations
	then.resultShouldBe('/foo/bar/baz.qux');
});

test('Normalizing converts backslashes to slashes', () => {
	when.normalizing('\\foo\\bar\\baz\\qux\\..');
	then.resultShouldBe('/foo/bar/baz');
});

test('Parsing converts backslashes to slashes', () => {
	when.parsing('\\foo\\bar\\baz.qux');
	then.resultShouldEqual({ root: '/', dir: '/foo/bar', base: 'baz.qux', ext: '.qux', name: 'baz' }); // eslint-disable-line unicorn/prevent-abbreviations
});

test('Getting relative path converts backslashes to slashes', () => {
	when.gettingRelativePath('\\foo', '\\foo\\bar\\baz.qux');
	then.resultShouldBe('bar/baz.qux');
});

test('Resolving path converts backslashes to slashes', () => {
	when.resolvingPath('\\foo', '\\bar', 'baz.qux');
	then.resultShouldBe('/bar/baz.qux');
});
