//--------------------------------------------------------
//-- IoC
//--------------------------------------------------------
'use strict';


const Application            = require('./lib');
const BaseProxy              = require('./lib/support/proxy/BaseProxy');
const CollectionMapper       = require('./lib/foundation/data/CollectionMapper');
const Command                = require('./lib/console/Command');
const ConsoleServiceProvider = require('./lib/console/BaseConsoleServiceProvider');
const ForwardProxy           = require('./lib/support/proxy/ForwardProxy');
const GeneratorCommand       = require('./lib/console/GeneratorCommand');
const Mapper                 = require('./lib/foundation/data/Mapper');
const mixins                 = require('./lib/support/mixins');
const Model                  = require('./lib/foundation/data/Model');
const NullDriverProxy        = require('./lib/support/drivers/NullDriverProxy');
const Repository             = require('./lib/foundation/data/Repository');
const ServiceProvider        = require('./lib/foundation/ServiceProvider');


// eslint-disable-next-line accessor-pairs
module.exports = {
	get app() { return require('./lib/app'); }, // eslint-disable-line global-require
	get classes() {
		return {
			Application,
			BaseProxy,
			CollectionMapper,
			Command,
			ConsoleServiceProvider,
			ForwardProxy,
			GeneratorCommand,
			Mapper,
			Model,
			NullDriverProxy,
			Repository,
			ServiceProvider
		};
	},
	get mixins() { return mixins; }
};
