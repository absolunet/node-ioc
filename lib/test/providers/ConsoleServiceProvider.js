//--------------------------------------------------------
//-- Spark Projects - Providers - Console service provider
//--------------------------------------------------------
'use strict';


const ConsoleServiceProvider = require('./../../console/BaseConsoleServiceProvider');


class TestConsoleServiceProvider extends ConsoleServiceProvider {

	/**
	 * {@inheritdoc}
	 */
	get dir() {
		return __dirname;
	}

}

module.exports = TestConsoleServiceProvider;
