//--------------------------------------------------------
//-- Tests - Unit - Database - Seeder - GWT
//--------------------------------------------------------

import gwt from './common.gwt';
const { given, when, then, build } = gwt;

import container from '../container';
import Seeder    from '../../../dist/node/database/Seeder';

let result;


//-- Mocks
//--------------------------------------------------------

const fakeConnection      = {};
const fakeFactory         = {};
const fakeModelRepository = {};
const fakeSeederInstance  = container.make(Seeder, { 'db.factory': fakeFactory, 'db.model': fakeModelRepository });
fakeSeederInstance.seed   = jest.fn();


//-- Given
//--------------------------------------------------------

given.emptyResult = () => {
	result = undefined;
};

given.fakeInstance = () => {
	Seeder.setDefaultInstance(fakeSeederInstance);
};


//-- When
//--------------------------------------------------------

when.gettingInstance = () => {
	when.attempting(() => {
		result = Seeder.getInstance();
	});
};

when.callingOnClassWithConnection = (method) => {
	when.attempting(() => {
		result = Seeder[method](fakeConnection);
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

then.resultShouldBeFakeInstance = () => {
	then.resultShouldBe(fakeSeederInstance);
};

then.shouldHaveCalledOnFakeInstanceWithConnection = (method) => {
	then.shouldNotHaveThrown();
	expect(fakeSeederInstance[method]).toHaveBeenCalledTimes(1);
	expect(fakeSeederInstance[method]).toHaveBeenCalledWith(fakeConnection);
};

then.resultShouldBePromise = () => {
	then.resultShouldBeInstanceOf(Promise);
};


export default build({ given, when, then });
