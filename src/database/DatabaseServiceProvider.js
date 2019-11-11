//--------------------------------------------------------
//-- Node IoC - Database - Database Service provider
//--------------------------------------------------------

import ServiceProvider        from '../foundation/ServiceProvider';
import Builder                from './services/Builder';
import Connector              from './services/Connector';
import Factory                from './services/Factory';
import ModelRepository        from './repositories/ModelRepository';
import ORM                    from './services/ORM';
import Resolver               from './services/Resolver';
import MakeFactoryCommand     from './commands/MakeFactoryCommand';
import MakeMigrationCommand   from './commands/MakeMigrationCommand';
import MakeModelCommand       from './commands/MakeModelCommand';
import MakeSeederCommand      from './commands/MakeSeederCommand';
import MigrateCommand         from './commands/MigrateCommand';
import MigrateFreshCommand    from './commands/MigrateFreshCommand';
import MigrateRefreshCommand  from './commands/MigrateRefreshCommand';
import MigrateRollbackCommand from './commands/MigrateRollbackCommand';
import MigrateStatusCommand   from './commands/MigrateStatusCommand';
import SeedCommand            from './commands/SeedCommand';


// eslint-disable-next-line jsdoc/require-description-complete-sentence
/**
 * The database service provider.
 * It binds the following services:
 * <ul>
 *     <li><a href="database.services.Builder.html">db</a></li>
 *     <li><a href="database.services.Connector.html">db.connection</a></li>
 *     <li><a href="database.services.Factory.html">db.factory</a></li>
 *     <li><a href="database.services.ORM.html">db.orm</a></li>
 *     <li><a href="database.services.Resolver.html">db.resolver</a></li>
 *     <li><a href="database.repositories.ModelRepository.html">db.model</a></li>
 *     <li><a href="database.repositories.ModelRepository.html">model (alias)</a></li>
 * </ul>
 * It also offers these commands:
 * <ul>
 *     <li><a href="database.commands.MakeFactoryCommand.html">make:factory</a></li>
 *     <li><a href="database.commands.MakeFactoryCommand.html">make:migration</a></li>
 *     <li><a href="database.commands.MakeFactoryCommand.html">make:model</a></li>
 *     <li><a href="database.commands.MakeFactoryCommand.html">make:seeder</a></li>
 *     <li><a href="database.commands.MakeFactoryCommand.html">db:migrate</a></li>
 *     <li><a href="database.commands.MakeFactoryCommand.html">db:migrate:fresh</a></li>
 *     <li><a href="database.commands.MakeFactoryCommand.html">db:migrate:refresh</a></li>
 *     <li><a href="database.commands.MakeFactoryCommand.html">db:migrate:rollback</a></li>
 *     <li><a href="database.commands.MakeFactoryCommand.html">db:migrate:status</a></li>
 *     <li><a href="database.commands.MakeFactoryCommand.html">db:seed</a></li>
 * </ul>
 * It also uses configuration under "database" namespace.
 *
 * @memberof database
 * @augments foundation.ServiceProvider
 * @hideconstructor
 */
class DatabaseServiceProvider extends ServiceProvider {

	/**
	 * @inheritdoc
	 */
	get name() {
		return 'Node IoC - Database';
	}

	/**
	 * Register the service provider.
	 */
	register() {
		this.loadAndPublishConfig(this.app.formatPath(__dirname, 'config'));
		this.bindConnectionBuilder();
		this.bindConnector();
		this.bindFactoryService();
		this.bindModelRepository();
		this.bindORM();
		this.bindResolver();
	}

	/**
	 * Boot the service provider.
	 */
	boot() {
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
	 * Bind connection builder service.
	 */
	bindConnectionBuilder() {
		this.app.singleton('db', Builder);
	}

	/**
	 * Bind database connector.
	 */
	bindConnector() {
		this.app.singleton('db.connection', Connector);
	}

	/**
	 * Bind model factory service.
	 */
	bindFactoryService() {
		this.app.singleton('db.factory', Factory);
	}

	/**
	 * Bind model repository.
	 */
	bindModelRepository() {
		this.app.singleton('db.model', ModelRepository);
		this.app.alias('model', 'db.model');
	}

	/**
	 * Bind ORM service.
	 */
	bindORM() {
		this.app.singleton('db.orm', ORM);
	}

	/**
	 * Bind database path resolver service.
	 */
	bindResolver() {
		this.app.singleton('db.resolver', Resolver);
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
		const folder  = this.app.make('db.resolver').resolvePath('factories');

		if (file.exists(folder)) {
			Object.values(file.loadInFolder(folder))
				.forEach((modelFactory) => {
					factory.register(modelFactory);
				});
		}
	}

}


export default DatabaseServiceProvider;
