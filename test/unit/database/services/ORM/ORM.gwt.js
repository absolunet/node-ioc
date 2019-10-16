//--------------------------------------------------------
//-- Tests - Unit - Database - Services - ORM - GWT
//--------------------------------------------------------
'use strict';

const { given, when, then, build } = require('../../common.gwt');

const container = require('../../../container');
const ORM       = require('../../../../../dist/node/database/services/ORM');

let orm;
let result;
let fakeDriverModels;


//-- Mocks
//--------------------------------------------------------

const fakeDriverEngine = {};

const otherDriverEngine = {};

const fakeConnection = {};

const fakeBuilder = {
	getConnection: jest.fn(() => {
		return fakeConnection;
	})
};

const fakeDriver = {
	model: jest.fn((name, model) => {
		if (typeof model !== 'undefined') {
			fakeDriverModels[name] = model;
		}

		return fakeDriverModels[name];
	}),
	engine: fakeDriverEngine
};

const otherDriverSpy = jest.fn();

const OtherDriver = class {

	constructor(...parameters) {
		otherDriverSpy(...parameters);
	}

	get engine() { return otherDriverEngine; }

};

const FooModel = class Foo {};


//-- Given
//--------------------------------------------------------

given.emptyResult = () => {
	result = undefined;
};

given.fakeBuilder = () => {
	container.singleton('db', fakeBuilder);
};

given.orm = () => {
	orm = container.make(ORM);
};

given.fakeDriverAsDefaultDriver = () => {
	orm.addDriver('fake', fakeDriver);
	orm.setDefaultDriver('fake');
	fakeDriverModels = {};
};

given.otherDriver = () => {
	orm.addDriver('other', OtherDriver);
};

given.fooModelIntoFakeDriver = () => {
	fakeDriverModels.foo = FooModel;
};


//-- When
//--------------------------------------------------------

when.registeringFooModel = () => {
	when.attempting(() => {
		orm.registerModel(FooModel);
	});
};

when.registeringFooModelAs = (name) => {
	when.attempting(() => {
		orm.registerModel(name, FooModel);
	});
};

when.gettingModel = (name) => {
	when.attempting(() => {
		result = orm.getModel(name);
	});
};

when.gettingEngine = () => {
	when.attempting(() => {
		result = orm.engine();
	});
};

when.gettingEngineOfOtherDriver = () => {
	when.attempting(() => {
		result = orm.engine('other');
	});
};

when.gettingOtherDriver = () => {
	when.attempting(() => {
		result = orm.driver('other');
	});
};


//-- Then
//--------------------------------------------------------

then.resultShouldBe = (expected) => {
	then.shouldNotHaveThrown();
	expect(result).toBe(expected);
};

then.fakeDriverShouldHaveReceivedFooModelWithName = (name) => {
	then.shouldNotHaveThrown();
	expect(fakeDriver.model).toHaveBeenCalledWith(name, FooModel);
};

then.shouldHaveReceivedFooModel = () => {
	then.resultShouldBe(FooModel);
};

then.shouldHaveReceivedFakeDriverEngine = () => {
	then.resultShouldBe(fakeDriverEngine);
};

then.shouldHaveReceivedOtherDriverEngine = () => {
	then.resultShouldBe(otherDriverEngine);
};

then.otherDriverShouldHaveReceivedCurrentConnection = () => {
	then.shouldNotHaveThrown();
	expect(otherDriverSpy).toHaveBeenCalledWith(fakeConnection);
};



module.exports = build({ given, when, then });
