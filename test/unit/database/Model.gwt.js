//--------------------------------------------------------
//-- Tests - Unit - Database - Model - GWT
//--------------------------------------------------------
'use strict';

const { given, when, then, build } = require('./common.gwt');

const BookshelfModel = require('bookshelf/lib/model');
const container      = require('../container');
const AbstractModel  = require('../../../lib/database/Model');

let model;
let baseModel;
let result;
let tableName;
let defaultValues;
let withTimestamps;
let primaryKeyType;
let primaryKey;


//-- Mocks
//--------------------------------------------------------

const spiedBoot = jest.fn();

const BaseModel = class BaseModel extends AbstractModel {

	boot() {
		return spiedBoot();
	}

	get table() {
		return tableName || super.table;
	}

	get defaults() {
		return defaultValues;
	}

	get timestamps() {
		return typeof withTimestamps !== 'undefined' ? withTimestamps : super.timestamps;
	}

	get key() {
		return primaryKey || super.key;
	}

	get keyType() {
		return primaryKeyType || super.keyType;
	}

};

BookshelfModel.prototype.where = jest.fn();

const fakeBookshelf = {
	Model: BookshelfModel
};


//-- Given
//--------------------------------------------------------

given.emptyResult = () => {
	result = undefined;
};

given.freshModelParameters = () => {
	tableName      = undefined;
	defaultValues  = undefined;
	withTimestamps = undefined;
	primaryKey     = undefined;
	primaryKeyType = undefined;
};

given.modelWithFakeBookshelfInstance = () => {
	baseModel = container.make(BaseModel, { engine: fakeBookshelf });
};

given.tableName = (value) => {
	tableName = value;
};

given.defaultValues = (value) => {
	defaultValues = value;
};

given.noTimestamps = () => {
	withTimestamps = false;
};

given.noUuid = () => {
	primaryKeyType = 'integer';
};

given.primaryKeyName = (value) => {
	primaryKey = value;
};


//-- When
//--------------------------------------------------------

when.querying = () => {
	when.creatingNewModel();
	when.attempting(() => {
		result = model.where('foo', 'bar');
	});
};

when.gettingTableName = () => {
	when.creatingNewModel();
	when.attempting(() => {
		result = model.tableName;
	});
};

when.creatingNewModel = () => {
	when.attempting(() => {
		model = new baseModel(); // eslint-disable-line new-cap
	});
};

when.makingModelTwice = () => {
	when.creatingNewModel();
	when.creatingNewModel();
};


//-- Then
//--------------------------------------------------------

then.resultShouldBe = (expected) => {
	then.shouldNotHaveThrown();
	expect(result).toBe(expected);
};

then.shouldHaveCalledWhereOnFakeBookshelfModel = () => {
	then.shouldNotHaveThrown();
	expect(BookshelfModel.prototype.where).toHaveBeenCalled();
};

then.shouldHaveGuessedTableNameBasedOnClassName = () => {
	then.resultShouldBe('base_models');
};

then.shouldHaveDefaultValues = (value) => {
	then.shouldNotHaveThrown();
	expect(model.defaults).toStrictEqual(value);
};

then.shouldNotHaveTimestampsInConfiguration = () => {
	then.shouldNotHaveThrown();
	expect(model.hasTimestamps).toBe(false);
};

then.shouldHaveReceivedUuidInConfiguration = () => {
	then.shouldNotHaveThrown();
	expect(model.uuid).toBe(true);
};

then.shouldNotHaveReceivedUuidInConfiguration = () => {
	then.shouldNotHaveThrown();
	expect(model.uuid).toBe(false);
};

then.shouldHaveReceivedAsDefaultPrimaryKeyName = (value) => {
	then.shouldNotHaveThrown();
	expect(model.idAttribute).toBe(value);
};

then.spiedBootShouldHaveBeenCalledTwice = () => {
	then.shouldNotHaveThrown();
	expect(spiedBoot).toHaveBeenCalledTimes(2);
};


module.exports = build({ given, when, then });
