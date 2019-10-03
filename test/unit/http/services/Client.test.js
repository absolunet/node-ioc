//--------------------------------------------------------
//-- Tests - Unit - HTTP - Services - Client
//--------------------------------------------------------
'use strict';

const { given, when, then } = require('./Client.gwt');


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
	given.emptyResult();
});


test('HTTP Client contains the same methods as Axios', () => {
	when.creatingHttpClient();
	then.clientHasSamePropertiesAndMethodAsAxios();
});
