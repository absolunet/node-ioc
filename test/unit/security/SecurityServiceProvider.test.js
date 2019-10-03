//--------------------------------------------------------
//-- Tests - Unit - Security - Security Service Provider
//--------------------------------------------------------
'use strict';

const { given, when, then } = require('./SecurityServiceProvider.gwt');


beforeEach(() => {
	given.providersAndDependencies();
});


test('Gate service is resolvable', () => {
	when.bootingContainer();
	then.gateServiceShouldBeResolvable();
});
