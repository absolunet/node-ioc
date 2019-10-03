//--------------------------------------------------------
//-- Tests - Unit - HTTP - Controllers - Redirect Controller
//--------------------------------------------------------
'use strict';

const { given, when, then } = require('./RedirectController.gwt');


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
	given.redirectController();
});


test('Can redirect to given URL', () => {
	when.redirecting();
	then.shouldHaveRedirectTemporarily();
});

test('Can permanently redirect to given URL', () => {
	when.redirectingPermanently();
	then.shouldHaveRedirectPermanently();
});
