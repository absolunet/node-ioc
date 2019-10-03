//--------------------------------------------------------
//-- Tests - Unit - Validation - Validation Service Provider
//--------------------------------------------------------
'use strict';

const { given, when, then } = require('./ValidationServiceProvider.gwt');


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
