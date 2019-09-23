//--------------------------------------------------------
//-- Tests - Unit - Validation - Services - Validator
//--------------------------------------------------------
'use strict';

const { given, when, then } = require('./Validator.gwt');


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
	given.validator();
});


test('Helper offers at least the same as Joi', () => {
	when.gettingKeys();
	then.resultShouldAtLeastMatchJoiKeys();
});
