//--------------------------------------------------------
//-- Tests - Unit - Config - Config stub
//--------------------------------------------------------
'use strict';

const FakeServiceProvider = require('./providers/FakeServiceProvider');

module.exports = {

	test: {
		foo: 'bar'
	},

	app: {
		providers: [
			FakeServiceProvider
		]
	}

};
