//--------------------------------------------------------
//-- Tests - Unit - Database - Migration - GWT
//--------------------------------------------------------
'use strict';

const { given, when, then, build } = require('./common.gwt');

const container = require('../container');
const Migration = require('../../../src/database/Migration');

let result;


//-- Mocks
//--------------------------------------------------------

const fakeConnection        = {};
const fakeMigrationInstance = container.make(Migration);
fakeMigrationInstance.up    = jest.fn();
fakeMigrationInstance.down  = jest.fn();


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

then.shouldHaveCalledOnFakeInstanceWithConnection = (method) => {
	then.shouldNotHaveThrown();
	expect(fakeMigrationInstance[method]).toHaveBeenCalledTimes(1);
	expect(fakeMigrationInstance[method]).toHaveBeenCalledWith(fakeConnection);
};

then.resultShouldBePromise = () => {
	then.resultShouldBeInstanceOf(Promise);
};


module.exports = build({ given, when, then });
