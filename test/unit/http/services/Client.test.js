//--------------------------------------------------------
//-- Tests - Unit - HTTP - Services - Client
//--------------------------------------------------------

import gwt from './Client.gwt';
const { given, when, then } = gwt;


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
	given.emptyResult();
});


test('HTTP Client contains the same methods as Axios', () => {
	when.creatingHttpClient();
	then.clientHasSamePropertiesAndMethodAsAxios();
});
