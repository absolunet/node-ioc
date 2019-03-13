//--------------------------------------------------------
//-- IoC
//--------------------------------------------------------
'use strict';

const app = require('./lib/app');
const Application = require('./lib');
const Command = require('./lib/console/Command');
const GeneratorCommand = require('./lib/console/GeneratorCommand');
const ServiceProvider = require('./lib/foundation/ServiceProvider');
const ConsoleServiceProvider = require('./lib/console/BaseConsoleServiceProvider');

// eslint-disable-next-line accessor-pairs
module.exports = {
	get app() { return app; },
	get Application() { return Application; },
	get Command() { return Command; },
	get GeneratorCommand() { return GeneratorCommand; },
	get ServiceProvider() { return ServiceProvider; },
	get ConsoleServiceProvider() { return ConsoleServiceProvider; }
};
