//--------------------------------------------------------
//-- IoC
//--------------------------------------------------------
'use strict';


const Application = require('./lib');
const Command = require('./lib/console/Command');
const GeneratorCommand = require('./lib/console/GeneratorCommand');
const ServiceProvider = require('./lib/foundation/ServiceProvider');
const ConsoleServiceProvider = require('./lib/console/BaseConsoleServiceProvider');


const hasDriver = require('./lib/foundation/mixins/hasDriver');


// eslint-disable-next-line accessor-pairs
module.exports = {
	get app() { return require('./lib/app'); }, // eslint-disable-line global-require
	get classes() {
		// eslint-disable-next-line accessor-pairs
		return {
			get Application() { return Application; },
			get Command() { return Command; },
			get GeneratorCommand() { return GeneratorCommand; },
			get ServiceProvider() { return ServiceProvider; },
			get ConsoleServiceProvider() { return ConsoleServiceProvider; }
		};
	},
	get mixins() {
		return {
			hasDriver
		};
	}
};
