//--------------------------------------------------------
//-- Tests - Unit - View - Services - Engine - Drivers - JsRender Driver - GWT
//--------------------------------------------------------

import gwt from '../../../common.gwt';
const { given, when, then, build } = gwt;

import container from '../../../../container';
import JsRenderDriver from '../../../../../../dist/node/view/services/Engine/drivers/JsRenderDriver';

let driver;
let template;
let viewModel;
let result;

let fakeConfig;
let fakeRoutes;
let fakeTranslations;


//-- Mocks
//--------------------------------------------------------

const fakeBindingFactory = jest.fn((abstract, concrete) => { return concrete; });

const fakeConfigRepository = {
	set: jest.fn((key, value) => {
		fakeConfig[key] = value;
	}),
	get: jest.fn((key, defaultValue = null) => {
		return fakeConfig[key] || defaultValue;
	})
};

const fakeRouter = {
	get: jest.fn((url) => {
		const route = {
			compilePath: jest.fn(() => { return route; }),
			compiledPath: url
		};
		route.name = (name) => {
			route.name = name;

			return route;
		};
		fakeRoutes.push(route);

		return route;
	})
};

const fakeRouteRepository = {
	findByName: jest.fn((name) => {
		const route = fakeRoutes.find(({ name: n }) => {
			return name === n;
		});

		if (!route) {
			throw new TypeError('Cannot find route');
		}

		return route;
	})
};

const fakeTranslator = {
	addTranslation: jest.fn((key, value) => {
		fakeTranslations[key] = value;
	}),
	translate: jest.fn((key) => {
		return fakeConfig[key] || key;
	})
};

//-- Given
//--------------------------------------------------------

given.driver = () => {
	driver = container.make(JsRenderDriver);
};

given.binding = (abstract, concrete) => {
	container.bind(abstract, (app) => {
		return app.make(fakeBindingFactory(abstract, concrete));
	});
};

given.fakeConfigRepository = () => {
	container.bind('config', fakeConfigRepository);
	fakeConfig = {};
};

given.fakeRouter = () => {
	container.bind('router', fakeRouter);
	fakeRoutes = [];
};

given.fakeRouteRepository = () => {
	container.bind('router.route', fakeRouteRepository);
};

given.fakeTranslator = () => {
	container.bind('translator', fakeTranslator);
	fakeTranslations = {};
};

given.emptyResult = () => {
	result = undefined;
};

given.template = (string) => {
	template = string;
};

given.viewModel = (model) => {
	viewModel = model;
};

given.config = (key, value) => {
	container.make('config').set(key, value);
};

given.route = (url, name) => {
	container.make('router').get(url, 'FakeController@method').name(name);
};

given.translation = (key, value) => {
	container.make('translator').addTranslation(key, value);
};


//-- When
//--------------------------------------------------------

when.makingTemplate = () => {
	when.attempting(() => {
		result = driver.make(template);
	});
};

when.renderingTemplate = () => {
	when.attempting(() => {
		result = driver.render(template, viewModel);
	});
};


//-- Then
//--------------------------------------------------------

then.resultShouldBe = (expected) => {
	then.shouldNotHaveThrown();
	expect(result).toBe(expected);
};

then.shouldHaveReceivedJsRenderTemplateInstance = () => {
	then.shouldNotHaveThrown();
	expect(result).toBeTruthy();
	expect(typeof result).toBe('function');
};

then.bindingShouldHaveBeenBuilt = (name) => {
	then.shouldNotHaveThrown();
	expect(fakeBindingFactory.mock.calls.some(([abstract]) => {
		return abstract === name;
	})).toBe(true);
};

then.fakeConfigRepositoryShouldHaveBeenCalledWith = (...parameters) => {
	then.shouldNotHaveThrown();
	expect(fakeConfigRepository.get).toHaveBeenCalledTimes(1);
	expect(fakeConfigRepository.get).toHaveBeenCalledWith(...parameters);
};

then.fakeRouteRepositoryShouldHaveBeenCalledWith = (...parameters) => {
	then.shouldNotHaveThrown();
	expect(fakeRouteRepository.findByName).toHaveBeenCalledTimes(1);
	expect(fakeRouteRepository.findByName).toHaveBeenCalledWith(...parameters);
};

then.routeShouldHavePathCompiled = (name) => {
	then.shouldNotHaveThrown();
	const fakeRoute = fakeRoutes.find(({ name: n }) => { return name === n; });
	expect(fakeRoute).toBeTruthy();
	expect(fakeRoute.compilePath).toHaveBeenCalledTimes(1);
};

then.fakeTranslatorShouldHaveBeenCalledWith = (...parameters) => {
	then.shouldNotHaveThrown();
	expect(fakeTranslator.translate).toHaveBeenCalledTimes(1);
	expect(fakeTranslator.translate).toHaveBeenCalledWith(...parameters);
};


export default build({ given, when, then });
