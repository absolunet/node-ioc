//--------------------------------------------------------
//-- Tests - Unit - Database - Model
//--------------------------------------------------------
'use strict';

const { given, when, then } = require('./Model.gwt');


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
	given.emptyResult();
	given.freshModelParameters();
});


test('Forward calls to the underlying Bookshelf model', () => {
	given.modelWithFakeBookshelfInstance();
	when.querying();
	then.shouldHaveCalledWhereOnFakeBookshelfModel();
});

test('Can guess table name based on model name', () => {
	given.modelWithFakeBookshelfInstance();
	when.gettingTableName();
	then.shouldHaveGuessedTableNameBasedOnClassName();
});

test('Can specify table name', () => {
	given.tableName('table_name');
	given.modelWithFakeBookshelfInstance();
	when.gettingTableName();
	then.resultShouldBe('table_name');
});

test('Can set default values', () => {
	given.defaultValues({ foo: 'bar' });
	given.modelWithFakeBookshelfInstance();
	when.creatingNewModel();
	then.shouldHaveDefaultValues({ foo: 'bar' });
});

test('Can specify that model does not use timestamps', () => {
	given.noTimestamps();
	given.modelWithFakeBookshelfInstance();
	when.creatingNewModel();
	then.shouldNotHaveTimestampsInConfiguration();
});

test('Uses UUID as primary key type by default', () => {
	given.modelWithFakeBookshelfInstance();
	when.creatingNewModel();
	then.shouldHaveReceivedUuidInConfiguration();
});

test('Can use integer as primary key', () => {
	given.noUuid();
	given.modelWithFakeBookshelfInstance();
	when.creatingNewModel();
	then.shouldNotHaveReceivedUuidInConfiguration();
});

test('Uses "id" as default primary key column', () => {
	given.modelWithFakeBookshelfInstance();
	when.creatingNewModel();
	then.shouldHaveReceivedAsDefaultPrimaryKeyName('id');
});

test('Can specify primary key column name', () => {
	given.primaryKeyName('other');
	given.modelWithFakeBookshelfInstance();
	when.creatingNewModel();
	then.shouldHaveReceivedAsDefaultPrimaryKeyName('other');
});

test('Can perform initialization actions', () => {
	given.modelWithFakeBookshelfInstance();
	when.makingModelTwice();
	then.spiedBootShouldHaveBeenCalledTwice();
});
