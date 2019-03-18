//--------------------------------------------------------
//-- IoC
//--------------------------------------------------------
'use strict';


const Application = require('./lib');
const CollectionMapper = require('./lib/foundation/data/CollectionMapper');
const Command = require('./lib/console/Command');
const ConsoleServiceProvider = require('./lib/console/BaseConsoleServiceProvider');
const GeneratorCommand = require('./lib/console/GeneratorCommand');
const Mapper = require('./lib/foundation/data/Mapper');
const Model = require('./lib/foundation/data/Model');
const Repository = require('./lib/foundation/data/Repository');
const ServiceProvider = require('./lib/foundation/ServiceProvider');


const hasDriver = require('./lib/foundation/mixins/hasDriver');


// eslint-disable-next-line accessor-pairs
module.exports = {
	get app() { return require('./lib/app'); }, // eslint-disable-line global-require
	get classes() {
		// eslint-disable-next-line accessor-pairs
		return {
			get Application() { return Application; },
			get CollectionMapper() { return CollectionMapper; },
			get Command() { return Command; },
			get ConsoleServiceProvider() { return ConsoleServiceProvider; },
			get GeneratorCommand() { return GeneratorCommand; },
			get Mapper() { return Mapper; },
			get Model() { return Model; },
			get Repository() { return Repository; },
			get ServiceProvider() { return ServiceProvider; }
		};
	},
	get mixins() {
		return {
			hasDriver
		};
	}
};
