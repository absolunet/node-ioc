//--------------------------------------------------------
//-- Tests - Unit - Log - Log Service Provider
//--------------------------------------------------------

import gwt from './LogServiceProvider.gwt';
const { given, when, then } = gwt;


beforeEach(() => {
	given.providersAndDependencies();
});


test('Logger service is resolvable', () => {
	when.bootingContainer();
	then.loggerServiceShouldBeResolvable();
});

test('Logger service is a singleton', () => {
	when.bootingContainer();
	then.loggerServiceShouldBeSingleton();
});
