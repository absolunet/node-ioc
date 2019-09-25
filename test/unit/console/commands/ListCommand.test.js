//--------------------------------------------------------
//-- Tests - Unit - Console - Commands - List Command
//--------------------------------------------------------
'use strict';

const { given, when, then } = require('./ListCommand.gwt');


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
});


test('Can list all available commands and global options', () => {

});
