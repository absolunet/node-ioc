//--------------------------------------------------------
//-- Tests - Unit - Database - Migration - GWT
//--------------------------------------------------------

import gwt from './common.gwt';
const { given, when, then, build } = gwt;

import container from '../container';
import Migration from '../../../dist/node/database/Migration';

let result;


//-- Mocks
//--------------------------------------------------------

const fakeConnection                = {};
const fakeMigrationInstance         = container.make(Migration);
fakeMigrationInstance.setConnection = jest.fn(() => { return fakeMigrationInstance; });
fakeMigrationInstance.up            = jest.fn(() => { return Promise.resolve(); });
fakeMigrationInstance.down          = jest.fn(() => { return Promise.resolve(); });


//-- Given
//--------------------------------------------------------

given.emptyResult = () => {
	result = undefined;
};

given.fakeInstance = () => {
	Migration.setDefaultInstance(fakeMigrationInstance);
};


//-- When
//--------------------------------------------------------

when.gettingInstance = () => {
	when.attempting(() => {
		result = Migration.getInstance();
	});
};

when.callingOnClassWithConnection = (method) => {
	when.attempting(() => {
		result = Migration[method](fakeConnection);
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
	then.resultShouldBe(fakeMigrationInstance);
};

then.shouldHaveReceivedConnection = () => {
	then.shouldNotHaveThrown();
	expect(fakeMigrationInstance.setConnection).toHaveBeenCalledWith(fakeConnection);
};

then.shouldHaveCalledOnFakeInstanceWithConnection = (method) => {
	then.shouldHaveReceivedConnection();
	expect(fakeMigrationInstance[method]).toHaveBeenCalledTimes(1);
};

then.resultShouldBePromise = () => {
	then.resultShouldBeInstanceOf(Promise);
};


export default build({ given, when, then });
