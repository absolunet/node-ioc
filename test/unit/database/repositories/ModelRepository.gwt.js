//--------------------------------------------------------
//-- Tests - Unit - Database - Repositories - Model Repository - GWT
//--------------------------------------------------------
'use strict';

const { given, when, then, build } = require('../common.gwt');

const container = require('../../container');
const ModelRepository = require('../../../../dist/node/database/repositories/ModelRepository');

let result;
let modelRepository;
let models;


//-- Mocks
//--------------------------------------------------------

const fakeOrm = {
	registerModel: jest.fn(),
	getModel: jest.fn((name) => {
		return models[name];
	})
};

const fakeModel = {};


//-- Given
//--------------------------------------------------------

given.emptyResult = () => {
	result = undefined;
};

given.fakeOrm = () => {
	container.singleton('db.orm', fakeOrm);
	models = {};
};

given.modelRepository = () => {
	modelRepository = container.make(ModelRepository);
};

given.model = () => {
	models.name = fakeModel;
};


//-- When
//--------------------------------------------------------

when.settingModel = () => {
	when.attempting(() => {
		modelRepository.set('name', fakeModel);
	});
};

when.gettingModel = () => {
	when.attempting(() => {
		result = modelRepository.get('name');
	});
};

when.checkingIfModelExists = () => {
	when.attempting(() => {
		result = modelRepository.has('name');
	});
};


//-- Then
//--------------------------------------------------------

then.resultShouldBe = (expected) =>  {
	then.shouldNotHaveThrown();
	expect(result).toBe(expected);
};

then.ormShouldHaveReceivedModel = () => {
	then.shouldNotHaveThrown();
	expect(fakeOrm.registerModel).toHaveBeenCalledWith('name', fakeModel);
};

then.shouldHaveReceivedModel = () => {
	then.resultShouldBe(fakeModel);
};


module.exports = build({ given, when, then });
