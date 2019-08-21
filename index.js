//--------------------------------------------------------
//-- IoC
//--------------------------------------------------------
'use strict';


const Application            = require('./lib');
const BaseProxy              = require('./lib/support/proxy/BaseProxy');
const Controller             = require('./lib/http/controllers/Controller');
const Command                = require('./lib/console/Command');
const ConsoleServiceProvider = require('./lib/console/BaseConsoleServiceProvider');
const ForwardProxy           = require('./lib/support/proxy/ForwardProxy');
const GeneratorCommand       = require('./lib/console/GeneratorCommand');
const Kernel                 = require('./lib/foundation/Kernel');
const Migration              = require('./lib/database/Migration');
const mixins                 = require('./lib/support/mixins');
const Model                  = require('./lib/database/Model');
const ModelFactory           = require('./lib/database/Factory');
const NullDriverProxy        = require('./lib/support/drivers/NullDriverProxy');
const ServiceProvider        = require('./lib/foundation/ServiceProvider');
const Seeder                 = require('./lib/database/Seeder');
const TestCase               = require('./lib/test/TestCase');
const Tester                 = require('./lib/test/services/Tester');


// eslint-disable-next-line accessor-pairs
module.exports = {
	get app() { return require('./lib/app'); }, // eslint-disable-line global-require
	get classes() {
		return {
			Application,
			BaseProxy,
			Controller,
			Command,
			ConsoleServiceProvider,
			ForwardProxy,
			GeneratorCommand,
			Kernel,
			Migration,
			Model,
			ModelFactory,
			NullDriverProxy,
			Seeder,
			ServiceProvider,
			TestCase,
			Tester
		};
	},
	get mixins() { return mixins; }
};
