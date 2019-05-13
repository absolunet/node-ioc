//--------------------------------------------------------
//-- Tests - Unit - Config - Dummy data
//--------------------------------------------------------
'use strict';

module.exports = {

	test: {
		foo: 'bar'
	},

	app: {
		providers: [
			'@/test/unit/config/stubs/providers/FakeServiceProvider.js'
		]
	}

};
