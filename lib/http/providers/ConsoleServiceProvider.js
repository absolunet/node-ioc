//--------------------------------------------------------
//-- Node IoC - HTTP - HTTP Console Service Provider
//--------------------------------------------------------
'use strict';

const ConsoleServiceProvider = require('../../console/BaseConsoleServiceProvider');


class HttpConsoleServiceProvider extends ConsoleServiceProvider {

	/**
	 * {@inheritdoc}
	 */
	get directory() {
		return __dirname;
	}

}

module.exports = HttpConsoleServiceProvider;
