//--------------------------------------------------------
//-- Tests - Unit - Database - Services - ORM - Drivers - Bookshelf Driver
//--------------------------------------------------------

import gwt from './BookshelfDriver.gwt';
const { given, when, then } = gwt;


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
	given.emptyResult();
	given.mockedBookshelf();
	given.mockedBookshelfUuid();
	given.fakeFileManager();
	given.fakeResolver();
});


test('Can make driver with engine instance gor injected connection', () => {
	given.connection();
	when.makingBookshelfDriver();
	then.bookshelfShouldHaveBeenInstantiatedWithConnection();
});

describe('Bookshelf driver instance', () => {

	beforeEach(() => {
		given.connection();
		given.bookshelfDriver();
	});


	test('Can build a new engine instance for given connection', () => {
		when.buildingEngineWithOtherConnection();
		then.bookshelfShouldHaveBeenInstantiatedWithOtherConnection();
	});

	test('Can get model instance', () => {
		given.fakeModelInBookshelf('foo');
		when.gettingModel('foo');
		then.shouldHaveReceivedFakeModel();
	});

	test('Can set model instance', () => {
		when.settingFakeModel('foo');
		then.bookshelfShouldHaveReceivedFakeModelWithName('foo');
	});

	test('Can get model with name only', () => {
		given.fakeModelInBookshelf('foo');
		when.callingModelMethod('foo');
		then.shouldHaveReceivedFakeModel();
	});

	test('Can set model with name and model', () => {
		when.callingModelMethodWithFakeModel('foo');
		then.shouldHaveReceivedFakeModelInstance();
		then.bookshelfShouldHaveReceivedFakeModelInstanceWithName('foo');
	});

	test('Can resolve model instance based on application model path', () => {
		given.fakeModelInFileManager('/path/to/models/Foo.js');
		given.fakeModelsPathInApplication('/path/to/models');
		when.callingBookshelfResolver('foo');
		then.shouldHaveResolvedModelsPath();
		then.shouldHaveReceivedFakeModelInstance();
	});

	test('Can build model instance', () => {
		when.buildingFakeModel();
		then.shouldHaveReceivedFakeModelInstance();
	});

	test('Can set engine with default plugins', () => {
		when.settingFakeEngine();
		then.fakeEngineShouldHaveReceivedTwoPlugins();
		then.fakeEngineShouldHaveReceivedResolveFunction();
	});

	test('Can get driver instance with given connection instance', () => {
		given.otherConnection();
		when.usingConnection();
		then.shouldHaveReceivedBookshelfDriverInstance();
		then.shouldNotHaveReceivedCurrentDriverInstance();
		then.resultShouldHaveOtherConnection();
	});

});
