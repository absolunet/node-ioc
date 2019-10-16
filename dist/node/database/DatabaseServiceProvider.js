"use strict";

exports.default = void 0;

var _ServiceProvider = _interopRequireDefault(require("../foundation/ServiceProvider"));

var _Builder = _interopRequireDefault(require("./services/Builder"));

var _Connector = _interopRequireDefault(require("./services/Connector"));

var _Factory = _interopRequireDefault(require("./services/Factory"));

var _ModelRepository = _interopRequireDefault(require("./repositories/ModelRepository"));

var _ORM = _interopRequireDefault(require("./services/ORM"));

var _Resolver = _interopRequireDefault(require("./services/Resolver"));

var _MakeFactoryCommand = _interopRequireDefault(require("./commands/MakeFactoryCommand"));

var _MakeMigrationCommand = _interopRequireDefault(require("./commands/MakeMigrationCommand"));

var _MakeModelCommand = _interopRequireDefault(require("./commands/MakeModelCommand"));

var _MakeSeederCommand = _interopRequireDefault(require("./commands/MakeSeederCommand"));

var _MigrateCommand = _interopRequireDefault(require("./commands/MigrateCommand"));

var _MigrateFreshCommand = _interopRequireDefault(require("./commands/MigrateFreshCommand"));

var _MigrateRefreshCommand = _interopRequireDefault(require("./commands/MigrateRefreshCommand"));

var _MigrateRollbackCommand = _interopRequireDefault(require("./commands/MigrateRollbackCommand"));

var _MigrateStatusCommand = _interopRequireDefault(require("./commands/MigrateStatusCommand"));

var _SeedCommand = _interopRequireDefault(require("./commands/SeedCommand"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Database - Database Service provider
//--------------------------------------------------------
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
class DatabaseServiceProvider extends _ServiceProvider.default {
  /**
   * Register the service provider.
   */
  register() {
    this.app.singleton('db', _Builder.default);
    this.app.singleton('db.connection', _Connector.default);
    this.app.singleton('db.factory', _Factory.default);
    this.app.singleton('db.model', _ModelRepository.default);
    this.app.singleton('db.orm', _ORM.default);
    this.app.singleton('db.resolver', _Resolver.default);
    this.app.alias('model', 'db.model');
  }
  /**
   * Boot the service provider.
   */


  boot() {
    this.loadConfig();
    this.createPolicies();
    this.loadAppModelFactories();
    this.loadCommands([_MakeFactoryCommand.default, _MakeMigrationCommand.default, _MakeModelCommand.default, _MakeSeederCommand.default, _MigrateCommand.default, _MigrateFreshCommand.default, _MigrateRefreshCommand.default, _MigrateRollbackCommand.default, _MigrateStatusCommand.default, _SeedCommand.default]);
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
      this.app.make('gate').policy('db', () => {
        const config = this.app.make('config');
        return Boolean(config.get('database.command_namespace', null)) && config.get('database.enabled', false);
      });
    }
  }
  /**
   * Load application model factories.
   */


  loadAppModelFactories() {
    const file = this.app.make('file');
    const factory = this.app.make('db.factory');
    const folder = this.app.make('db.resolver').resolvePath('factories');

    if (file.exists(folder)) {
      Object.values(file.loadInFolder(folder)).forEach(modelFactory => {
        factory.register(modelFactory);
      });
    }
  }

}

var _default = DatabaseServiceProvider;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;