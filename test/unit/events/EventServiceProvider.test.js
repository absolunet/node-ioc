//--------------------------------------------------------
//-- Tests - Unit - Events - Event Service Provider
//--------------------------------------------------------

import gwt from './EventServiceProvider.gwt';
const { given, when, then } = gwt;


beforeEach(() => {
	given.providersAndDependencies();
});


test('Event service is resolvable', () => {
	when.bootingContainer();
	then.eventServiceShouldBeResolvable();
});

test('Event service is a singleton', () => {
	when.bootingContainer();
	then.eventServiceShouldBeSingleton();
});
