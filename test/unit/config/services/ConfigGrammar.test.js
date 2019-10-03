//--------------------------------------------------------
//-- Tests - Unit - Config - Services - Config Grammar
//--------------------------------------------------------
'use strict';

const { given, when, then } = require('./ConfigGrammar.gwt');


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
	given.fakeEnvironmentRepository();
	given.fakeEvaluator();
	given.configGrammar();
});


test('Does not impact plain text', () => {
	when.formatting('Lorem ipsum');
	then.resultShouldBe('Lorem ipsum');
});

test('Can transform path starting with "@/"', () => {
	given.basePath('/base/path');
	when.formatting('@/foo/bar');
	then.resultShouldBe('/base/path/foo/bar');
});

test('Does not transform path having a "@/" anywhere but at the start', () => {
	given.basePath('/base/path');
	when.formatting('foo/@/bar');
	then.resultShouldBe('foo/@/bar');
});

test('Does not transform path starting with "@" without slash directly after', () => {
	given.basePath('/base/path');
	when.formatting('@foo/bar');
	then.resultShouldBe('@foo/bar');
});

test('Can transform path starting with "~/"', () => {
	given.homePath('/home/path');
	when.formatting('~/foo/bar');
	then.resultShouldBe('/home/path/foo/bar');
});

test('Does not transform path having a "~/" anywhere but at the start', () => {
	given.homePath('/home/path');
	when.formatting('foo/~/bar');
	then.resultShouldBe('foo/~/bar');
});

test('Does not transform path starting with "~" without slash directly after', () => {
	given.homePath('/home/path');
	when.formatting('~foo/bar');
	then.resultShouldBe('~foo/bar');
});

test('Can replace "{{KEY}}" by the given environment variable value', () => {
	given.environmentVariable('KEY', 'value');
	when.formatting('{{KEY}}');
	then.resultShouldBe('value');
});

test('Can replace an unexisting environment variable by null', () => {
	given.deletedEnvironmentVariable('KEY');
	when.formatting('{{KEY}}');
	then.resultShouldBe('null');
});

test('Can replace an unexisting environment variable by a fallback value', () => {
	given.deletedEnvironmentVariable('KEY');
	when.formatting('{{KEY|default value}}');
	then.resultShouldBe('default value');
});

test('Environment variable with space are not parsed', () => {
	given.environmentVariable('KEY WITH SPACE', 'value');
	when.formatting('{{KEY WITH SPACE}}');
	then.resultShouldBe('{{KEY WITH SPACE}}');
});

test('Missing brace at the beginning prevent from parsing environment variable', () => {
	given.environmentVariable('KEY', 'value');
	when.formatting('{KEY}}');
	then.resultShouldBe('{KEY}}');
});

test('Missing brace at the end prevent from parsing environment variable', () => {
	given.environmentVariable('KEY', 'value');
	when.formatting('{{KEY}');
	then.resultShouldBe('{{KEY}');
});

test('Fallback environment variable value separate by other character than a pipe is ignored', () => {
	given.deletedEnvironmentVariable('KEY');
	when.formatting('{{KEY/default value}}');
	then.resultShouldBe('{{KEY/default value}}');
});

test('Fallback environment variable value can contain pipe', () => {
	given.deletedEnvironmentVariable('KEY');
	when.formatting('{{KEY|default|value}}');
	then.resultShouldBe('default|value');
});

test('Environment variable can be parsed if in the middle of a string', () => {
	given.environmentVariable('KEY', 'value');
	when.formatting('This is a {{KEY}} inside a string');
	then.resultShouldBe('This is a value inside a string');
});

test('Can format path only with a "@/" at the beginning', () => {
	given.basePath('/base/path');
	when.formattingPath('@/foo/bar');
	then.resultShouldBe('/base/path/foo/bar');
});

test('Can format path only with a "~/" at the beginning', () => {
	given.homePath('/home/path');
	when.formattingPath('~/foo/bar');
	then.resultShouldBe('/home/path/foo/bar');
});

test('Can format path only and ignore environment parsing', () => {
	given.environmentVariable('KEY', 'value');
	when.formattingPath('{{KEY}}');
	then.resultShouldBe('{{KEY}}');
});

test('Can format environment only with a "{{KEY}}"', () => {
	given.environmentVariable('KEY', 'value');
	when.formattingEnvironment('{{KEY}}');
	then.resultShouldBe('value');
});

test('Can format environment only and ignore path parsing with "@/" at the beginning', () => {
	given.basePath('/base/path');
	when.formattingEnvironment('@/foo/bar');
	then.resultShouldBe('@/foo/bar');
});

test('Can format environment only and ignore path parsing with "~/" at the beginning', () => {
	given.homePath('/home/path');
	when.formattingEnvironment('~/foo/bar');
	then.resultShouldBe('~/foo/bar');
});

