//--------------------------------------------------------
//-- Tests - Unit - Security - Security Service Provider
//--------------------------------------------------------

import gwt from './SecurityServiceProvider.gwt';
const { given, when, then } = gwt;


beforeEach(() => {
	given.providersAndDependencies();
});


test('Gate service is resolvable', () => {
	when.bootingContainer();
	then.gateServiceShouldBeResolvable();
});
