//--------------------------------------------------------
//-- Tests - Unit - Events - Event Service Provider
//--------------------------------------------------------
'use strict';

const { given, when, then } = require('./EventServiceProvider.gwt');


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
