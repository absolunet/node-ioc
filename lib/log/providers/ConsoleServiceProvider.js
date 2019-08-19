//--------------------------------------------------------
//-- Node IoC - Log - Console Service provider
//--------------------------------------------------------
'use strict';

const ConsoleServiceProvider = require('../../console/BaseConsoleServiceProvider');


class LogConsoleServiceProvider extends ConsoleServiceProvider {

	/**
	 * {@inheritdoc}
	 */
	get directory() {
		return __dirname;
	}

}


module.exports = LogConsoleServiceProvider;
