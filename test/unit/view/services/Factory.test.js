//--------------------------------------------------------
//-- Tests - Unit - View - Services - Factory
//--------------------------------------------------------

import gwt from './Factory.gwt';
const { given, when, then } = gwt;


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
	given.viewModel(undefined);
	given.emptyResult();
});


describe('Factory', () => {

	beforeEach(() => {
		given.factoryWithFakeDependencies();
		given.viewName('foo');
	});


	test('Call engine with resolved path from given view name', () => {
		when.makingView();
		then.shouldHaveReturnedEngineResultFromResolverPath();
	});

	test('Call engine with resolved path from given view name and view-model', () => {
		given.viewModel({ key: 'value' });
		when.makingView();
		then.shouldHaveReturnedEngineResultFromResolverPath();
		then.shouldHavePassedViewModelToEngineMethod();
	});

});


describe('Full compilation pipeline', () => {

	beforeEach(() => {
		given.stubsViewPath();
		given.factoryWithRealDependencies();
	});


	test('Can compile view from name', () => {
		given.viewName('test');
		when.makingView();
		then.resultShouldBe(`<p>Test</p>\n`);
	});

	test('Can compile view from name and data', () => {
		given.viewName('components.with-slot');
		given.viewModel({ slot: 'Test' });
		when.makingView();
		then.resultShouldBe(`<p>Test</p>\n`);
	});

	test('Can compile view including other view', () => {
		given.viewName('components.including-empty');
		when.makingView();
		then.resultShouldBe(`<div>\n\t<p>Including empty</p>\n\t<p>Empty component</p>\n\n</div>\n`);
	});

	test('Can compile view including other view with content in slot', () => {
		given.viewName('components.including-slot');
		when.makingView();
		then.resultShouldBe(`<div>\n\t<p>Including slot</p>\n\t<p>\n\t\tContent\n\t</p>\n\n</div>\n`);
	});

});
