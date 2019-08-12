//--------------------------------------------------------
//-- Tests - Unit - Database
//--------------------------------------------------------
'use strict';


const container               = require('../common');
const DatabaseServiceProvider = require('../../../lib/database/providers/DatabaseServiceProvider');


describe('Node IoC - Database', () => {

	beforeEach(() => {
		container.register(DatabaseServiceProvider);
		container.bootIfNotBooted();
	});

	test('Works', () => {
		expect(container.make('db').toBeTruthy());
	});

});
