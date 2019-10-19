//--------------------------------------------------------
//-- Tests - Unit - Validation - Validation Service Provider
//--------------------------------------------------------

import gwt from './ValidationServiceProvider.gwt';
const { given, when, then } = gwt;


beforeEach(() => {
	given.providersAndDependencies();
});


test('Validator service is resolvable', () => {
	when.bootingContainer();
	then.validatorServiceIsResolvable();
});

test('Validator service is a singleton', () => {
	when.bootingContainer();
	then.validatorServiceShouldBeSingleton();
});
