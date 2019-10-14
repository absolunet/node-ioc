//--------------------------------------------------------
//-- Tests - Unit - HTTP - Repositories - Controller Repository - GWT
//--------------------------------------------------------
'use strict';

const { given, when, then, build } = require('../common.gwt');

const path                 = require('path');
const container            = require('../../container');
const ControllerRepository = require('../../../../src/http/repositories/ControllerRepository');

let controllerRepository;
let result;
let action;


//-- Mocks
//--------------------------------------------------------

const fakeController = class {};


//-- Given
//--------------------------------------------------------

given.emptyResult = () => {
	result = undefined;
};

given.controllerRepository = () => {
	controllerRepository = container.make(ControllerRepository);
};

given.controller = () => {
	controllerRepository.add('StubController', fakeController);
};

given.fakeAppPath = () => {
	container.useBasePath(path.dirname(__dirname));
	container.useAppPath('stubs');
};

given.action = (value) => {
	action = value;
};


//-- When
//--------------------------------------------------------

when.addingController = () => {
	when.attempting(() => {
		controllerRepository.add('StubController', fakeController);
	});
};

when.gettingControllerByName = () => {
	when.attempting(() => {
		result = controllerRepository.get('StubController');
	});
};

when.gettingControllerWithNamespaceByName = () => {
	when.attempting(() => {
		result = controllerRepository.get('namespace.StubController');
	});
};

when.gettingControllerByPath = () => {
	when.attempting(() => {
		result = controllerRepository.getFromPath(path.join(__dirname, '..', 'stubs', 'http', 'controllers'), 'StubController');
	});
};

when.checkingIfControllerExists = () => {
	when.attempting(() => {
		result = controllerRepository.has('StubController');
	});
};

when.creatingGroupWithController = () => {
	when.attempting(() => {
		controllerRepository.group('namespace', (repository) => {
			repository.add('StubController', fakeController);
		});
	});
};

when.resolvingControllerActionName = () => {
	when.attempting(() => {
		result = controllerRepository.resolveAction(action);
	});
};

when.resolvingControllerName = () => {
	when.attempting(() => {
		result = controllerRepository.resolveName(action);
	});
};


//-- Then
//--------------------------------------------------------

then.resultShouldBe = (expected) => {
	then.shouldNotHaveThrown();
	expect(result).toBe(expected);
};

then.resultShouldBeInstanceOf = (expected) => {
	then.shouldNotHaveThrown();
	expect(result).toBeInstanceOf(expected);
};

then.shouldHaveReceivedController = () => {
	then.resultShouldBeInstanceOf(fakeController);
};

then.shouldHaveReceivedStubController = () => {
	then.resultShouldBeInstanceOf(require('../stubs/http/controllers/StubController')); // eslint-disable-line global-require
};

then.shouldHaveReceivedNamespaceStubController = () => {
	then.resultShouldBeInstanceOf(require('../stubs/http/controllers/namespace/StubController')); // eslint-disable-line global-require
};

then.controllerShouldBeBindToApplication = () => {
	then.shouldNotHaveThrown();
	expect(container.isBound('controller.StubController')).toBe(true);
};

then.controllerShouldBeBindToApplicationWithPrefix = () => {
	then.shouldNotHaveThrown();
	expect(container.isBound('controller.namespace.StubController')).toBe(true);
};


module.exports = build({ given, when, then });
