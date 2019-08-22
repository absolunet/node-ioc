//--------------------------------------------------------
//-- Node IoC - Database - Database Service provider
//--------------------------------------------------------
'use strict';

const path                   = require('path');
const ConsoleServiceProvider = require('./ConsoleServiceProvider');
const ServiceProvider        = require('../../foundation/ServiceProvider');

const Builder         = require('../services/Builder');
const Connector       = require('../services/Connector');
const Factory         = require('../services/Factory');
const ModelRepository = require('../repositories/ModelRepository');
const ORM             = require('../services/ORM');
const Resolver        = require('../services/Resolver');


class DatabaseServiceProvider extends ServiceProvider {

	/**
	 * Register service provider.
	 */
	register() {
		this.app.make('config').loadConfigFromFolder(path.join(__dirname, '..', 'config'));

		this.app.singleton('db',            Builder);
		this.app.singleton('db.connection', Connector);
		this.app.singleton('db.factory',    Factory);
		this.app.singleton('db.model',      ModelRepository);
		this.app.singleton('db.orm',        ORM);
		this.app.singleton('db.resolver',   Resolver);

		this.app.alias('model', 'db.model');

		this.app.register(ConsoleServiceProvider);
	}

	/**
	 * Boot service provider.
	 */
	boot() {
		this.createPolicies();
		this.loadAppModelFactories();
	}

	/**
	 * Create database related policies.
	 */
	createPolicies() {
		this.app.make('gate')
			.policy('db', () => {
				const config = this.app.make('config');

				return Boolean(config.get('database.command_namespace', null)) && config.get('database.enabled', false);
			});
	}

	/**
	 * Load application model factories.
	 */
	loadAppModelFactories() {
		const file    = this.app.make('file');
		const factory = this.app.make('db.factory');

		const folder = this.app.make('db.resolver').resolvePath('factories');

		if (file.exists(folder)) {
			Object.values(file.loadInFolder(folder))
				.forEach((modelFactory) => {
					factory.register(modelFactory);
				});
		}
	}

}


module.exports = DatabaseServiceProvider;