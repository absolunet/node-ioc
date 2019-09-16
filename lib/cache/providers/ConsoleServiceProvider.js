//--------------------------------------------------------
//-- Node IoC - Cache - Cache Console Service Provider
//--------------------------------------------------------
'use strict';

const ConsoleServiceProvider = require('../../console/BaseConsoleServiceProvider');


class CacheConsoleServiceProvider extends ConsoleServiceProvider {

	/**
	 * {@inheritdoc}
	 */
	get directory() {
		return __dirname;
	}

}

module.exports = CacheConsoleServiceProvider;
