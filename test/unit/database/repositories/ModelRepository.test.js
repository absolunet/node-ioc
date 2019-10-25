//--------------------------------------------------------
//-- Tests - Unit - Database - Repositories - Model Repository
//--------------------------------------------------------

import gwt from './ModelRepository.gwt';
const { given, when, then } = gwt;


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
	given.fakeOrm();
	given.modelRepository();
});


test('Can set model through ORM', () => {
	when.settingModel();
	then.ormShouldHaveReceivedModel();
});

test('Can get model by name through ORM', () => {
	given.model();
	when.gettingModel();
	then.shouldHaveReceivedModel();
});

test('Throws if model does not exists in ORM', () => {
	when.gettingModel();
	then.shouldHaveThrown();
});

test('Can check if model exists', () => {
	given.model();
	when.checkingIfModelExists();
	then.resultShouldBe(true);
});

test('Can check if model does not exists', () => {
	when.checkingIfModelExists();
	then.resultShouldBe(false);
});
