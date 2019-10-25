//--------------------------------------------------------
//-- Tests - Unit - Support - Helpers - String Helper
//--------------------------------------------------------

import gwt from './StringHelper.gwt';
const { given, when, then } = gwt;


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
	given.stringHelper();
	given.emptyResult();
	given.string(undefined);
});


test('Can convert to camel case', () => {
	given.string('foo_bar');
	when.convertingToCamelCase();
	then.resultShouldBe('fooBar');
});

test('Can convert to constant case', () => {
	given.string('foo_bar');
	when.convertingToConstantCase();
	then.resultShouldBe('FOO_BAR');
});

test('Can convert to dot case', () => {
	given.string('foo_bar');
	when.convertingToDotCase();
	then.resultShouldBe('foo.bar');
});

test('Can convert to pascal case', () => {
	given.string('foo_bar');
	when.convertingToPascalCase();
	then.resultShouldBe('FooBar');
});

test('Can convert to sentence', () => {
	given.string('foo_bar');
	when.convertingToSentence();
	then.resultShouldBe('Foo bar');
});

test('Can convert to slug case', () => {
	given.string('foo_bar');
	when.convertingToSlugCase();
	then.resultShouldBe('foo-bar');
});

test('Can convert to snake case', () => {
	given.string('FooBar');
	when.convertingToSnakeCase();
	then.resultShouldBe('foo_bar');
});

test('Can convert to title case', () => {
	given.string('foo_bar');
	when.convertingToTitleCase();
	then.resultShouldBe('Foo Bar');
});
