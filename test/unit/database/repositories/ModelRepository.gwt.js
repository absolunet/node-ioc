//--------------------------------------------------------
//-- Tests - Unit - Database - Repositories - Model Repository - GWT
//--------------------------------------------------------

import gwt from '../common.gwt';
const { given, when, then, build } = gwt;

import container from '../../container';
import ModelRepository from '../../../../dist/node/database/repositories/ModelRepository';

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


export default build({ given, when, then });
