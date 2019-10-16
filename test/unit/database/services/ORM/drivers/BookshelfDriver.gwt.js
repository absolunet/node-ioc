//--------------------------------------------------------
//-- Tests - Unit - Database - Services - ORM - Drivers - Bookshelf Driver - GWT
//--------------------------------------------------------
'use strict';

const { given, when, then, build } = require('../../../common.gwt');

const container       = require('../../../../container');
const BookshelfDriver = require('../../../../../../dist/node/database/services/ORM/drivers/BookshelfDriver');

let result;
let bookshelfDriver;
let connection;
let mockedBookshelfModels;
let otherBookshelfModels;
let fakeFiles;

//-- Mocks
//--------------------------------------------------------

const mockedBookshelf = {
	model:      jest.fn((name, model) => {
		if (model) {
			mockedBookshelfModels[name] = model;
		}

		return mockedBookshelfModels[name];
	}),
	plugin:     jest.fn(),
	resolve:    null,
	Collection: {
		extend: jest.fn((values) => {
			return { ...mockedBookshelf.Collection, ...values };
		})
	}
};

const otherBookshelf = {
	model:      jest.fn((name, model) => {
		if (model) {
			otherBookshelfModels[name] = model;
		}

		return otherBookshelfModels[name];
	}),
	plugin:     jest.fn(),
	resolve:    null,
	Collection: {
		extend: jest.fn((values) => {
			return { ...otherBookshelf.Collection, ...values };
		})
	}
};

const mockedBookshelfFactory = jest.fn(() => {
	return mockedBookshelf;
});

const mockedBookshelfUuidPlugin = {};

const fakeFileManager = {
	exists: jest.fn((filePath) => {
		return Object.keys(fakeFiles).includes(filePath);
	}),
	load: jest.fn((filePath) => {
		if (Object.keys(fakeFiles).includes(filePath)) {
			return fakeFiles[filePath];
		}

		throw new TypeError('An error has occurred...');
	})
};

const fakeResolver = {
	resolvePath: jest.fn((type) => {
		const mapping = { models: 'model' };

		return container.make(`path.${mapping[type]}`);
	})
};

const fakeConnection  = {};
const otherConnection = {};

const FakeModel = class FakeModel {};


//-- Given
//--------------------------------------------------------

given.emptyResult = () => {
	result = undefined;
};

given.mockedBookshelf = () => {
	jest.mock('bookshelf', () => {
		return mockedBookshelfFactory;
	});
	mockedBookshelfModels = {};
	otherBookshelfModels = {};
};

given.mockedBookshelfUuid = () => {
	jest.mock('bookshelf-uuid', () => {
		return mockedBookshelfUuidPlugin;
	});
};

given.fakeFileManager = () => {
	container.singleton('file', fakeFileManager);
	fakeFiles = {};
};

given.fakeResolver = () => {
	container.singleton('db.resolver', fakeResolver);
};

given.connection = () => {
	connection = fakeConnection;
};

given.otherConnection = () => {
	connection = otherConnection;
};

given.bookshelfDriver = () => {
	bookshelfDriver = container.make(BookshelfDriver, { connection });
};

given.fakeModelInBookshelf = (name) => {
	mockedBookshelfModels[name] = FakeModel;
};

given.fakeModelInFileManager = (filePath) => {
	fakeFiles[filePath] = FakeModel;
};

given.fakeModelsPathInApplication = (modelsPath) => {
	container.bind('path.model', modelsPath);
};


//-- When
//--------------------------------------------------------

when.makingBookshelfDriver = () => {
	when.attempting(() => {
		bookshelfDriver = container.make(BookshelfDriver, { connection });
		result          = bookshelfDriver;
	});
};

when.buildingEngineWithOtherConnection = () => {
	when.attempting(() => {
		result = bookshelfDriver.buildEngine(otherConnection);
	});
};

when.gettingModel = (name) => {
	when.attempting(() => {
		result = bookshelfDriver.getModel(name);
	});
};

when.settingFakeModel = (name) => {
	when.attempting(() => {
		result = bookshelfDriver.setModel(name, FakeModel);
	});
};

when.callingModelMethod = (...parameters) => {
	when.attempting(() => {
		result = bookshelfDriver.model(...parameters);
	});
};

when.callingModelMethodWithFakeModel = (name) => {
	when.callingModelMethod(name, FakeModel);
};

when.callingBookshelfResolver = (name) => {
	when.attempting(() => {
		result = mockedBookshelf.resolve(name);
	});
};

when.buildingFakeModel = () => {
	when.attempting(() => {
		result = bookshelfDriver.buildModel(FakeModel);
	});
};

when.settingFakeEngine = () => {
	when.attempting(() => {
		result = bookshelfDriver.setEngine(otherBookshelf);
	});
};

when.usingConnection = () => {
	when.attempting(() => {
		result = bookshelfDriver.withConnection(connection);
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

then.bookshelfShouldHaveBeenInstantiatedWith = (...parameters) => {
	then.shouldNotHaveThrown();
	expect(mockedBookshelfFactory).toHaveBeenCalledWith(...parameters);
};

then.bookshelfShouldHaveBeenInstantiatedWithConnection = () => {
	then.bookshelfShouldHaveBeenInstantiatedWith(fakeConnection);
};

then.bookshelfShouldHaveBeenInstantiatedWithOtherConnection = () => {
	then.bookshelfShouldHaveBeenInstantiatedWith(otherConnection);
};

then.shouldHaveReceivedFakeModel = () => {
	then.resultShouldBe(FakeModel);
};

then.shouldHaveReceivedFakeModelInstance = () => {
	then.resultShouldBeInstanceOf(FakeModel);
};

then.bookshelfShouldHaveReceivedFakeModelWithName = (name) => {
	then.shouldNotHaveThrown();
	expect(mockedBookshelf.model).toHaveBeenCalledWith(name, FakeModel);
};

then.bookshelfShouldHaveReceivedFakeModelInstanceWithName = (name) => {
	then.shouldNotHaveThrown();
	expect(mockedBookshelf.model).toHaveBeenCalled();
	const [[givenName, givenInstance]] = mockedBookshelf.model.mock.calls;
	expect(givenName).toBe(name);
	expect(givenInstance).toBeInstanceOf(FakeModel);
};

then.shouldHaveResolvedModelsPath = () => {
	then.shouldNotHaveThrown();
	expect(fakeResolver.resolvePath).toHaveBeenCalledWith('models');
	expect(fakeFileManager.exists).toHaveBeenCalled();
	expect(fakeFileManager.load).toHaveBeenCalled();
};

then.fakeEngineShouldHaveReceivedTwoPlugins = () => {
	then.shouldNotHaveThrown();
	expect(otherBookshelf.plugin).toHaveBeenCalledTimes(2);
};

then.fakeEngineShouldHaveReceivedResolveFunction = () => {
	then.shouldNotHaveThrown();
	expect(otherBookshelf.resolve).not.toBeNull();
	expect(typeof otherBookshelf.resolve).toBe('function');
};

then.shouldHaveReceivedBookshelfDriverInstance = () => {
	then.resultShouldBeInstanceOf(BookshelfDriver);
};

then.shouldNotHaveReceivedCurrentDriverInstance = () => {
	then.shouldNotHaveThrown();
	expect(result).not.toBe(bookshelfDriver);
};

then.resultShouldHaveOtherConnection = () => {
	then.shouldNotHaveThrown();
	expect(result.connection).toBe(otherConnection);
};


module.exports = build({ given, when, then });
