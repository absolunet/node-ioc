//--------------------------------------------------------
//-- Tests - Unit - View - Services - Resolver
//--------------------------------------------------------

import gwt from './Resolver.gwt';
const { given, when, then } = gwt;


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
	given.stubsViewPath();
	given.resolver();
});


test('Uses application path to resolve views', () => {
	when.gettingResolverPath();
	then.shouldHaveReceivedStubsViewPath();
});

test('Can resolve file', () => {
	given.viewName('test');
	when.findingView();
	then.resultShouldBe(`<p>Test</p>\n`);
});

test('Fails when trying to resolve unexisting file', () => {
	given.viewName('unexisting');
	when.findingView();
	then.shouldHaveThrown();
});

test('Can check if file exists', () => {
	given.viewName('test');
	when.checkingIfViewExists();
	then.resultShouldBe(true);
});

test('Can check if file does not exist', () => {
	given.viewName('unexisting');
	when.checkingIfViewExists();
	then.resultShouldBe(false);
});

test('Can register namespace', () => {
	given.namespace();
	given.viewName('namespace::test');
	when.findingView();
	then.resultShouldBe(`<p>Namespace</p>\n`);
});

test('Fails when trying to resolve unexisting namespace', () => {
	given.viewName('namespace::test');
	when.findingView();
	then.shouldHaveThrown();
});
