//--------------------------------------------------------
//-- Node IoC - Database - Database Service provider
//--------------------------------------------------------
'use strict';

const ServiceProvider        = require('../foundation/ServiceProvider');

const Builder         = require('./services/Builder');
const Connector       = require('./services/Connector');
const Factory         = require('./services/Factory');
const ModelRepository = require('./repositories/ModelRepository');
const ORM             = require('./services/ORM');
const Resolver        = require('./services/Resolver');

const MakeFactoryCommand     = require('./commands/MakeFactoryCommand');
const MakeMigrationCommand   = require('./commands/MakeMigrationCommand');
const MakeModelCommand       = require('./commands/MakeModelCommand');
const MakeSeederCommand      = require('./commands/MakeSeederCommand');
const MigrateCommand         = require('./commands/MigrateCommand');
const MigrateFreshCommand    = require('./commands/MigrateFreshCommand');
const MigrateRefreshCommand  = require('./commands/MigrateRefreshCommand');
const MigrateRollbackCommand = require('./commands/MigrateRollbackCommand');
const MigrateStatusCommand   = require('./commands/MigrateStatusCommand');
const SeedCommand            = require('./commands/SeedCommand');


class DatabaseServiceProvider extends ServiceProvider {

	/**
	 * Register the service provider.
	 */
	register() {
		this.app.singleton('db',            Builder);
		this.app.singleton('db.connection', Connector);
		this.app.singleton('db.factory',    Factory);
		this.app.singleton('db.model',      ModelRepository);
		this.app.singleton('db.orm',        ORM);
		this.app.singleton('db.resolver',   Resolver);

		this.app.alias('model', 'db.model');
	}

	/**
	 * Boot the service provider.
	 */
	boot() {
		this.loadConfig();
		this.createPolicies();
		this.loadAppModelFactories();
		this.loadCommands([
			MakeFactoryCommand,
			MakeMigrationCommand,
			MakeModelCommand,
			MakeSeederCommand,
			MigrateCommand,
			MigrateFreshCommand,
			MigrateRefreshCommand,
			MigrateRollbackCommand,
			MigrateStatusCommand,
			SeedCommand
		]);
	}

	/**
	 * Load configuration file.
	 */
	loadConfig() {
		if (this.app.isBound('config')) {
			this.app.make('config').loadConfigFromFolder(this.app.formatPath(__dirname, '..', 'config'));
		}
	}

	/**
	 * Create database related policies.
	 */
	createPolicies() {
		if (this.app.isBound('gate')) {
			this.app.make('gate')
				.policy('db', () => {
					const config = this.app.make('config');

					return Boolean(config.get('database.command_namespace', null)) && config.get('database.enabled', false);
				});
		}
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
