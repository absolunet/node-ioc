//--------------------------------------------------------
//-- Tests - Unit - Validation - Services - Validator
//--------------------------------------------------------

import gwt from './Validator.gwt';
const { given, when, then } = gwt;


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
	given.validator();
});


test('Helper offers at least the same as Joi', () => {
	when.gettingKeys();
	then.resultShouldAtLeastMatchJoiKeys();
});
