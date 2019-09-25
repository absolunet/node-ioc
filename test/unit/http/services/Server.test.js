//--------------------------------------------------------
//-- Tests - Unit - HTTP - Services - Server
//--------------------------------------------------------
'use strict';

const { given, when, then } = require('./Server.gwt');


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
});


test('Can make an Express HTTP server instance', () => {

});
