//--------------------------------------------------------
//-- Tests - Unit - View - Services - Engine - Drivers - JsRender Driver
//--------------------------------------------------------

import gwt from './JsRenderDriver.gwt';
const { given, when, then } = gwt;

beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
	given.driver();
	given.emptyResult();
	given.viewModel(undefined);
});


test('Can make template instance', () => {
	given.template('<p>Foo</p>');
	when.makingTemplate();
	then.shouldHaveReceivedJsRenderTemplateInstance();
});

test('Can render template', () => {
	given.template('<p>Foo</p>');
	when.renderingTemplate();
	then.resultShouldBe('<p>Foo</p>');
});

test('Can render template with one parameter with view-model', () => {
	given.template('<p>{{:text}}</p>');
	given.viewModel({ text: 'Foo' });
	when.renderingTemplate();
	then.resultShouldBe('<p>Foo</p>');
});


test('Can render template with multiple parameters with view-model', () => {
	given.template('<p>{{:text}} {{:other}}</p>');
	given.viewModel({ text: 'Test', other: 'Foo' });
	when.renderingTemplate();
	then.resultShouldBe('<p>Test Foo</p>');
});

test('Can render template with parameter without view-model', () => {
	given.template(`<p>{{:text}}</p>`);
	when.renderingTemplate();
	then.resultShouldBe('<p></p>');
});

test('Can render template with parameter without appropriate view-model', () => {
	given.template('<p>{{:text}}</p>');
	given.viewModel({ foo: 'bar' });
	when.renderingTemplate();
	then.resultShouldBe('<p></p>');
});

test('Can render template without parameters even if parameters are given', () => {
	given.template('<p>Foo</p>');
	given.viewModel({ foo: 'bar' });
	when.renderingTemplate();
	then.resultShouldBe('<p>Foo</p>');
});

test('Can use dependency injection', () => {
	given.template(`<p>{{:~inject('foo').bar()}}</p>`);
	given.binding('foo', { bar() { return 'baz'; } });
	when.renderingTemplate();
	then.resultShouldBe('<p>baz</p>');
	then.bindingShouldHaveBeenBuilt('foo');
});

test('Can use configuration', () => {
	given.template(`<p>{{:~config('foo')}}</p>`);
	given.fakeConfigRepository();
	given.config('foo', 'bar');
	when.renderingTemplate();
	then.resultShouldBe('<p>bar</p>');
	then.fakeConfigRepositoryShouldHaveBeenCalledWith('foo');
});

test('Can use router to display a resolved route URL', () => {
	given.template(`<a href="{{:~route('foo.bar')}}">Link</a>`);
	given.fakeRouter();
	given.fakeRouteRepository();
	given.route('/foo/bar', 'foo.bar');
	when.renderingTemplate();
	then.resultShouldBe('<a href="/foo/bar">Link</a>');
	then.fakeRouteRepositoryShouldHaveBeenCalledWith('foo.bar');
});

test('Can use translator', () => {
	given.template(`<p>{{:~t('foo')}}</p>`);
	given.fakeTranslator();
	given.translation('foo', 'bar');
	when.renderingTemplate();
	then.resultShouldBe('<p>bar</p>');
	then.fakeTranslatorShouldHaveBeenCalledWith('foo');
});
