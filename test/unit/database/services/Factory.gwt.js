//--------------------------------------------------------
//-- Tests - Unit - Database - Services - Factory - GWT
//--------------------------------------------------------
'use strict';

const { given, when, then, build } = require('../common.gwt');

const container = require('../../container');
const Factory   = require('../../../../lib/database/services/Factory');

const fakeNames = ['one', 'two', 'three', 'four', 'five', 'six'];

let result;
let factory;
let currentIndex;


//-- Mocks
//--------------------------------------------------------

const fooModelSpy           = jest.fn();
const fooModelCollectionSpy = jest.fn((models) => { return models; });

const FooModel = class {

	static get collection() {
		return fooModelCollectionSpy;
	}

	constructor(parameters) {
		fooModelSpy(parameters);
		this.attributes = parameters;
	}

};

const fakeModelRepository = {
	get: jest.fn((name) => {
		if (name === 'foo') {
			return FooModel;
		}

		throw new TypeError('An error has occurred...');
	})
};

const fakeFaker = {
	name: {
		findName: jest.fn(() => {
			return fakeNames[currentIndex++];
		})
	}
};

const modelFactoryForFoo = {
	model: 'foo',
	make: jest.fn((faker) => {
		return {
			bar: faker.name.findName(),
			qux: faker.name.findName()
		};
	})
};

const otherModelFactoryForFoo = {
	model: 'foo',
	make: jest.fn((faker) => {
		return {
			bar: faker.name.findName(),
			qux: faker.name.findName()
		};
	})
};


//-- Given
//--------------------------------------------------------

given.emptyResult = () => {
	result = undefined;
};

given.fakeModelRepository = () => {
	container.singleton('db.model', fakeModelRepository);
};

given.fakeFaker = () => {
	container.singleton('faker', fakeFaker);
	currentIndex = 0;
};

given.factory = () => {
	factory = container.make(Factory);
};

given.modelFactoryForFoo = () => {
	factory.register(modelFactoryForFoo);
};

given.otherModelFactoryForFoo = () => {
	factory.register(otherModelFactoryForFoo);
};

given.modelFactoryFor = (name) => {
	factory.register(modelFactoryForFoo, name);
};


//-- When
//--------------------------------------------------------

when.gettingModelFactoryFor = (name) => {
	when.attempting(() => {
		result = factory.get(name);
	});
};

when.making = (...parameters) => {
	when.attempting(() => {
		result = factory.make(...parameters);
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

then.shouldHaveReceivedModelFactoryForFoo = () => {
	then.resultShouldBe(modelFactoryForFoo);
};

then.shouldHaveReceivedOtherModelFactoryForFoo = () => {
	then.resultShouldBe(otherModelFactoryForFoo);
};

then.shouldHaveReceivedOneFactoriedModel = () => {
	then.resultShouldBeInstanceOf(FooModel);
};

then.shouldHaveReceivedTwoFactoriedModelInCollection = () => {
	then.shouldNotHaveThrown();
	expect(Array.isArray(result)).toBe(true);
	expect(result).toHaveLength(2);
	expect(fooModelCollectionSpy).toHaveBeenCalled();
	expect(result[0]).toBeInstanceOf(FooModel);
	expect(result[1]).toBeInstanceOf(FooModel);
};

then.twoModelsShouldHaveDifferentAttributes = () => {
	then.shouldHaveReceivedTwoFactoriedModelInCollection();
	expect(result[0]).not.toMatchObject(result[1]);
};

then.givenModelAttributeShouldMatch = (model, expected) => {
	then.shouldNotHaveThrown();
	expect(model.attributes).toMatchObject(expected);
};

then.modelAttributesShouldMatch = (expected) => {
	then.givenModelAttributeShouldMatch(result, expected);
};

then.modelsAttributesShouldMatch = (expected) => {
	result.forEach((model) => {
		then.givenModelAttributeShouldMatch(model, expected);
	});
};


module.exports = build({ given, when, then });
