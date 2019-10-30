//--------------------------------------------------------
//-- Tests - Unit - View - Services - Factory - GWT
//--------------------------------------------------------

import gwt from '../common.gwt';
const { given, when, then, build } = gwt;

import * as path from 'path';
import container from '../../container';
import Factory   from '../../../../dist/node/view/services/Factory';

let factory;
let viewName;
let viewModel;
let result;


//-- Mocks
//--------------------------------------------------------

const fakeEngine = {
	render: jest.fn(() => { return '<p>Foo</p>'; })
};

const fakeResolver = {
	find: jest.fn(),
	getViewPath: jest.fn((name) => {
		return name.split('.').join('/');
	})
};


//-- Given
//--------------------------------------------------------

given.factoryWithRealDependencies = () => {
	factory = container.make(Factory);
};

given.factoryWithFakeDependencies = () => {
	factory = container.make(Factory, {
		'view.engine':   fakeEngine,
		'view.resolver': fakeResolver
	});
};

given.stubsViewPath = () => {
	container.configurePaths({ view: path.join(__dirname, '..', 'stubs', 'views') });
};

given.viewName = (name) => {
	viewName = name;
};

given.viewModel = (model) => {
	viewModel = model;
};

given.emptyResult = () => {
	result = undefined;
};


//-- When
//--------------------------------------------------------

when.makingView = () => {
	when.attempting(() => {
		result = factory.make(viewName, viewModel);
	});
};


//-- Then
//--------------------------------------------------------

then.resultShouldBe = (expected) => {
	then.shouldNotHaveThrown();
	expect(result).toBe(expected);
};

then.shouldHaveRenderedOnce = () => {
	then.shouldNotHaveThrown();
	expect(fakeEngine.render).toHaveBeenCalledTimes(1);
};

then.shouldHaveReturnedEngineResultFromResolverPath = () => {
	then.shouldHaveRenderedOnce();
	expect(fakeResolver.find).toHaveBeenCalledTimes(1);
	expect(fakeEngine.render.mock.calls[0][0]).toBe(fakeResolver.find.mock.results[0].value);
	expect(fakeEngine.render).toHaveReturnedWith(result);
};

then.shouldHaveMetaData = () => {
	then.shouldHaveRenderedOnce();
	expect(fakeEngine.render.mock.calls[0][1]).toStrictEqual({
		__meta: {
			name: viewName,
			path: viewName.split('.').join('/')
		}
	});
};

then.shouldHavePassedViewModelToEngineMethodWithMetaData = () => {
	then.shouldHaveRenderedOnce();
	expect(fakeEngine.render.mock.calls[0][1]).toStrictEqual({
		...viewModel,
		__meta: {
			name: viewName,
			path: viewName.split('.').join('/')
		}
	});
};


export default build({ given, when, then });
