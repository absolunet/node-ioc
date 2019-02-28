//--------------------------------------------------------
//-- Spark IoC - Console - Console Service Provider
//--------------------------------------------------------
'use strict';


const ServiceProvider = require('./../../foundation/ServiceProvider');
const CommandRepository = require('./../repository/CommandRepository');

class ConsoleServiceProvider extends ServiceProvider {

	register() {
		this.app.singleton('command', CommandRepository);
	}

	boot() {
		this.app.make('command').add(require('./../../../test/unit/console/stubs/commands/TestCommand')); // eslint-disable-line
	}

}

module.exports = ConsoleServiceProvider;
