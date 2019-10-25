//--------------------------------------------------------
//-- Tests - Unit - HTTP - Controllers - Redirect Controller
//--------------------------------------------------------

import gwt from './RedirectController.gwt';
const { given, when, then } = gwt;


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
