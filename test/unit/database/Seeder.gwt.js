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

const fakeSeederInstance           = container.make(Seeder, { 'db.factory': fakeFactory, 'db.model': fakeModelRepository });
const spiedFakeSeederSetConnection = jest.spyOn(fakeSeederInstance, 'setConnection');
fakeSeederInstance.seed            = jest.fn(() => { return Promise.resolve(); });

const otherSeederInstance           = container.make(Seeder, { 'db.factory': fakeFactory, 'db.model': fakeModelRepository });
const spiedOtherSeederSetConnection = jest.spyOn(otherSeederInstance, 'setConnection');
otherSeederInstance.seed            = jest.fn(() => { return Promise.resolve(); });


//-- Given
//--------------------------------------------------------

given.emptyResult = () => {
	result = undefined;
};

given.fakeInstance = () => {
	Seeder.setDefaultInstance(fakeSeederInstance);
};

given.fakeSeederPath = () => {
	container.bind('path.seed', '/path/to/seeds');
};

given.otherSeederInSeederPath = () => {
	container.singleton('/path/to/seeds/OtherSeeder', otherSeederInstance);
};


//-- When
//--------------------------------------------------------

when.gettingInstance = () => {
	when.attempting(() => {
		result = Seeder.getInstance();
	});
};

when.callingOnClassWithConnection = async (method) => {
	await when.attemptingAsync(async () => {
		await Seeder[method](fakeConnection);
	});
};

when.callingSyncOnClassWithConnection = (method) => {
	when.attempting(() => {
		result = Seeder[method](fakeConnection);
	});
};

when.running = async (seeders) => {
	await when.attemptingAsync(async () => {
		await fakeSeederInstance.setConnection(fakeConnection).run(seeders);
	});
};

when.runningOtherSeederByName = async () => {
	await when.running(['OtherSeeder']);
};

when.runningOtherSeederByReference = async () => {
	await when.running([otherSeederInstance]);
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
	expect(spiedFakeSeederSetConnection).toHaveBeenCalledTimes(1);
	expect(spiedFakeSeederSetConnection).toHaveBeenCalledWith(fakeConnection);
	expect(fakeSeederInstance[method]).toHaveBeenCalledTimes(1);
};

then.resultShouldBePromise = () => {
	then.resultShouldBeInstanceOf(Promise);
};

then.shouldHaveRunOtherSeeder = () => {
	expect(spiedOtherSeederSetConnection).toHaveBeenCalledTimes(1);
	expect(spiedOtherSeederSetConnection).toHaveBeenCalledWith(fakeConnection);
	expect(otherSeederInstance.seed).toHaveBeenCalledTimes(1);
};


export default build({ given, when, then });
