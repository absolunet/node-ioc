//--------------------------------------------------------
//-- Node IoC - Database - Console Service provider
//--------------------------------------------------------
'use strict';

const ConsoleServiceProvider = require('../../console/BaseConsoleServiceProvider');


class DatabaseConsoleServiceProvider extends ConsoleServiceProvider {

	/**
	 * {@inheritdoc}
	 */
	get directory() {
		return __dirname;
	}

}


module.exports = DatabaseConsoleServiceProvider;
