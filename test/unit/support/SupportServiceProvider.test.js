//--------------------------------------------------------
//-- Tests - Unit - Support - Support Service Provider
//--------------------------------------------------------

import gwt from './SupportServiceProvider.gwt';
const { given, when, then } = gwt;


beforeEach(() => {
	given.providersAndDependencies();
});


test('Date helper is resolvable', () => {
	when.bootingContainer();
	then.dateHelperShouldBeResolvable();
});

test('File helper is resolvable', () => {
	when.bootingContainer();
	then.fileHelperShouldBeResolvable();
});

test('Path helper is resolvable', () => {
	when.bootingContainer();
	then.pathHelperShouldBeResolvable();
});

test('String helper is resolvable', () => {
	when.bootingContainer();
	then.stringHelperShouldBeResolvable();
});

test('Faker service is resolvable', () => {
	when.bootingContainer();
	then.fakerShouldBeResolvable();
});

test('Faker service is a singleton', () => {
	when.bootingContainer();
	then.fakerShouldBeSingleton();
});
