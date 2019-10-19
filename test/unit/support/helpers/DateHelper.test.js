//--------------------------------------------------------
//-- Tests - Unit - Support - Helpers - String Helper
//--------------------------------------------------------

import gwt from './DateHelper.gwt';
const { given, when, then } = gwt;


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
	given.dateHelper();
	given.emptyResult();
});


test('Helper can build a moment.js instance', () => {
	when.callingHelperAsFunction();
	then.resultShouldBeMomentInstance();
});

test('Helper offers at least the same as Moment.js', () => {
	when.gettingKeys();
	then.resultShouldAtLeastMatchMomentKeys();
});
