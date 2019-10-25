# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).






## [Unreleased]



## [1.0.0-alpha.1] - 2019-10-25

### Added
 - JSDoc API documentation
 - Security, support, contribution guidelines and code of conduct
 - GitHub templates
 - `exception.handler` drivers for complex error rendering
 - `ouch` HTTP error rendering
 - `pretty-error` console error handling
 - `dumper` service to dump data in Web page for inspection, or in console if not in an HTTP request
 - `dump()` JSRender helper function to dump data in current rendered template
 - HTTP error classes: `HttpError`, `BadRequestHttpError`, `UnauthorizedHttpError`, `ForbiddenHttpError`, `NotFoundHttpError`, `MethodNotAllowedHttpError` and `TimeoutHttpError`

### Changed
 - Conversion to ECMAScript modules over CommonJS with Webpack compilation
 - Main entry point is now located from `lib/index.js` to `dist/node/index.js`
 - Default support for application conversion to ECMAScript modules (source and distribution folders)
 - Commands are public by default instead of being private
 - `make:command` replace `--public` flag to `--private` (see line above)
 - `logging` configuration renamed to `log`
 - Update `@absolunet/manager` to `2.0.0`
 - Update `@absolunet/tester` to `3.0.4`
 - Update `@hapi/joi` to `16.1.7`
 - Update `bookshelf` to `1.0.1`
 - Update `deepmerge` to `4.2.1`
 - Update `dotenv` to `8.2.0`
 - Update `knex` to `0.19.5`
 - Update `nodemon` to `1.19.4`
 - Update `replace-in-file` to `4.2.0`
 - Update `yargs` to `14.2.0`

### Fixed
 - Node.js `>=12.0.0` instead of `>=12.5.0` (lowest LTS version will be used over time, such as `12.0.0`, `14.0.0`, etc.) 

### Removed
 - Moved bootstrapped application to the application repository 



## [0.10.0] - 2019-10-10

### Added
 - `make:controller` scaffold command to create controller class file
 - `helper.path` helper that exposes the `path` core module, enhanced with `slash`
 - Complete unit tests left undone

### Changed
 - Enhanced command descriptions
 - Update `@hapi/joi` to `16.1.5`
 - Update `jsrender` to `1.0.5`
 - Update `nodemon` to `1.19.3`

### Fixed
 - ESLint error fixed (tests was not properly run before the previous release, fixed)



## [0.9.0] - 2019-10-03

### Added
 - `path.home` resolves to the home directory
 - `command.runner` service to handle command execution
 - `yargs` console engine that exposes `yargs` package
 - `NotImplementedError` to emulate error when an abstract method was not implemented on runtime execution
 - `file.system.async` and `file.system.sync` injectable file systems to expose Async and Sync systems
 - `ensureProviderCanBeRegistered` method that is used to prevent booting phase registration
 - `http` configuration to enable the server features and to configure timeout delay
 - Controller supports new status methods: `ok`, `created`, `accepted`, `noContent`, `badRequest`, `methodNotAllowed`, `timeout` and `teapot`

### Changed
 - Given-When-Then unit tests for better readability and extended cases and coverage
 - Main entry point is now located from `index.js` to `lib/index.js`
 - Classes are now exposed at the first level instead of under `classes` namespace
 - All writing methods in `file` module now use `(fileName, content)` signature
 - `evaluator` converts `undefined` to `null`
 - `evaluator` does not evaluate non-primitive types anymore
 - `command.registrar` does not instantiate the command before sending it to the `command` repository
 - `loadCommands` method stores the commands in the repository instead of the registrar
 - HTTP server as singleton support
 - Application is manually made in the exposed application
 - Full usage of injected properties based on dependencies name instead of directly relying on private repository

### Fixed
 - `.env` parsing error keeps current environment in `env` repository
 - Make all library classes easier to test

### Removed
 - `dependencies` and `init` cannot be configured anymore in the container
 - Routing module removed and its content merged with the HTTP module



## [0.8.3] - 2019-09-17

### Changed
 - Main file lazyloads all exposed classes
 - Service providers are now all located in root folder of their modules instead of the `providers` folder
 - `loadCommands` service provider method allowing command registration from manual insertion
 - Remove all `ConsoleServiceProvider` classes in modules exposing commands (keeps the `console/ConsoleServiceProvider`)
 



## [0.8.2] - 2019-09-17

### Changed
 - Main file lazyloads `classes` key content
 - All required packages that may have performance impact are lazyloaded
 - File systems now forward calls to `@absolunet/fs[sp]` packages instead of extending them
 - `faker` now forwards calls to `faker` package instead of returning it



## [0.8.1] - 2019-09-16

### Added
 - `view` configuration file with `engine` support, default to `jsrender`

### Changed
 - Internal usage of `app.formatPath` instead of `path.join` and `slash`
 - Configuration loaded on booting phase instead of registration phase



## [0.8.0] - 2019-09-16

### Added
 - Cache module for database and file caching
 - `cache` manager to use configured cache
 - `runtime` cache driver for static cache in local variable
 - `file` cache driver for file caching in JSON format
 - `database` cache driver for database caching in given connection
 - `cache` configuration file with `runtime`, `file` and `database` stores
 - `cache:clear` command to clear all the current cache
 - `cache:forget` command to drop a single cache key
 - `cache:table` scaffold command to create database migration for cache
 - Translation module for basic i18n support
 - `translator` service to translate in current locale
 - `file` translation driver to fetch translations from `yaml`/`yml`/`json`/`js` files
 - `writeAsync` method in `file` manager
 - `path.lang` resolves to the `resources/lang` application folder
 - `formatPath` method in the Application to properly format path using `path` core module and `slash` for Windows OS support
 - `bootDriver` hook can be implemented in class extending `hasDriver` mixin
 - `expectBound` assertion in `TestCase`

### Changed
 - Move `SupportServiceProvider` from Kernel to Application core bootstrapper
 - `json` file manager driver uses `writeJson` method from both file systems
 - `jsrender` module now exposed through `engine` property in `jsrender` view engine driver
 - Update `@hapi/joi` to `16.0.1`
 - Update `bookshelf` to `1.0.0`

### Fixed
 - `storage/logs` folder removed from `npm` publication

### Removed
 - `bookshelf` ORM driver does not bootstrap the plugins anymore since done by `bookshelf` itself since `1.0.0`



## [0.7.2] - 2019-09-11

### Added
 - `stack` logging channels to log in multiple channels at the same time

### Changed
 - Change `yargs` parsing to strict mode
 - Update `knex` to `0.19.4`
 


## [0.7.1] - 2019-09-09

### Added
 - `level` logging channel threshold to prevent unwanted log types



## [0.7.0] - 2019-09-09

### Added
 - `helper.file` helper to handle file size parsing and formatting
 - `limit` configuration for log channel to prevent keeping too many logs

### Changed
 - Core bootstrappers are registered before any other service providers, but are booted within the regular booting flow
 - Moving `onBooting` and `onBooted` into local queue and wait until core bootstrappers are registered before using `event`
 - Move `ConfigServiceProvider` from Kernel to Application core bootstrapper
 - `exception.handler` now render as response if request and response objects are passed as parameters
 - `exception.handler` formats response to JSON if request accepts `application/json`
 - `file` log channel renamed to `single`
 - Update `@absolunet/tester` to `2.6.9`
 - Update `@absolunet/terminal` to `2.1.1`
 - Update `inquirer` to `7.0.0`
 - Update `nodemon` to `1.19.2`

### Fixed
 - Add support for file scaffold through generator command with folder namespace such as `make:command foo/BarCommand`

### Removed
 - `tester` does not accept providers on `boot` and `createFreshApplication` methods



## [0.6.2] - 2019-08-22

### Changed
 - Use `en` locale`in `yargs` to prevent parsing issues
 - Use `filename` SQLite database configuration name to comply with `knex` nomenclature
 - Rename `command` application command folder to `commands`



## [0.6.1] - 2019-08-21

### Changed
 - Version in `package.json` to fix deployment issues



## [0.6.0] - 2019-08-21

### Added
 - Database module with `knex` and `bookshelf` packages with `sqlite` support only
 - `Model` base class as database model with `bookshelf`
 - `Factory` base class for model factory
 - `Seeder` base class for database seeding through `knex`
 - `Migration` base class for database migration through `knex`
 - `make:factory` scaffold command
 - `make:migration` scaffold command
 - `make:model` scaffold command
 - `make:seeder` scaffold command
 - `db:migrate` migration command
 - `db:migrate:fresh` migration command
 - `db:migrate:refresh` migration command
 - `db:migrate:rollback` migration command
 - `db:migrate:status` migration command
 - `db:seed` seed command
 - `db.model` repository to register and retrieve models
 - `db` connection builder to create `knex` connection through configuration
 - `db.connection` service to create connection with parameters
 - `db.orm` service to use `bookshelf` with connection
 - `db.factory` service to manage model factory
 - Event module with `EventEmitter` core module and `pubsubjs` package
 - `event` dispatcher service
 - `emitter` dispatcher driver with `EventEmitter` core class
 - `pubsubjs` dispatcher driver with `pubsubjs` implementation
 - `path.database` resolves to the `database` application folder
 - `path.storage` resolves to the `storage` application folder
 - `path.test` resolves to the `test` application folder
 - Logging module with file and database log features
 - `log` service that follows the [PSR-3 LoggerInterface](https://www.php-fig.org/psr/psr-3/#3-psrlogloggerinterface)
 - `logging` configuration namespace with `file` and `database` channels
 - `log:table` scaffold command to create database migration for logs
 - `Enum` base class to create enums with a OOP approach
 - `helper.date` helper that exposes `moment` package
 - `faker` service that exposes `faker` package
 - `exception.handler` report the exception through `logger` before rendering error

### Changed
 - File engine uses `sync` system by default instead of relying on configuration

### Removed
 - File system configuration support removed
 - Deprecated data mapper, collection mapper, model, and repository removed



## [0.5.0] - 2019-07-30

### Added
 - `validator` service that exposes the `@hapi/joi` package
 - Allow to directly stream through controller

### Changed
 - Add `express`'s `json` support

### Fixed
 - Support commands in subfolder auto-registration



## [0.4.4] - 2019-07-26

### Changed
 - Use `dot-object`'s `override` flag to prevent useless code



## [0.4.3] - 2019-07-26

### Added
 - Async and Sync engine systems that extends `@absolunet/fsp` and `@absolunet/fss` features
 - Add `replace-in-file` module
 - Implement `replace-in-file` in Async and Sync file engine systems
 - `helper.string` helper

### Fixed
 - Prevent service provider multiple registration

### Removed
 - Unused Jest dependencies removed from `devDependencies` in `package.json`



## [0.4.2] - 2019-07-22

### Changed
 - Update `dot-object` to `1.8.1`
 - Update `inquirer` to `6.5.0`
 - Update `table` to `5.4.4`
 - Update `yargs` to `13.3.0`



## [0.4.1] - 2019-07-21

### Added
 - `.env` support
 - `env` repository to get environment variables
 - Support for environment variable in configuration through the `{{VAR_NAME}}` syntax
 - `evaluator` service to evaluate and dynamically cast values.



## [0.4.0] - 2019-07-17

### Added
 - Dynamic controller resolving to prevent manual registration for application
 - Stdout interceptor to allow third parties to use output data.
 - `streamCommand` controller method to stream command output

### Changed
 - Move route handling to a `route.handler` service that handles the request through either a closure or a controller action
 - Update `jest-extended` to `0.11.2`



## [0.3.1] - 2019-07-11

### Fixed
 - `test` module now deployed with NPM as it was ignored by the `.npmignore` file



## [0.3.0] - 2019-07-11

### Added
 - View module for template rendering
 - `view` service which makes template rendering
 - `view.resolver` which resolves the template paths
 - `view.engine` which uses the configured engine to compile templates
 - `JSRender` view engine driver
 - `path.public` resolves to the `resources/static` folder of the application
 - `path.resources` resolves to the `resources` folder of the application
 - `path.view` resolves to the `resources/view` folder of the application
 - `StaticController` to serve static content from given folder
 - Minimalist HTTP error handling
 - `nodemon` added to the `serve` command to be used through the `--daemon` flag
 - Simple status methods from the controller (`unauthorized()`, `forbidden()` and `notFound()`)

### Changed
 - Node supported version goes to `>=12.5.0`

### Fixed
 - Exceptions catch by the `exception.handler` during controller handling



## [0.2.0] - 2019-07-08

### Added
 - HTTP routing through Express server
 - HTTP request handling through controllers
 - `serve` command to start an Express server
 - `RedirectController` to handle redirection
 - Test module to implement unit and feature tests in classes instead of functions
 - `run` method in commands to run node commands
 - `alias` method in `Container`

### Changed
 - Update `axios` to `0.19.0`
 - Update `@absolunet/manager` to `1.1.0`
 - Update `@absolunet/tester` to `2.6.8`

### Fixed
 - Test coverage from git repository
 - Change token `COMMAND` to `CLASS` for file generation through `GeneratorCommand`
 - Exceptions catch by the `exception.handler` during command execution
 - Yargs console print space set to a minimum of 120 width
 - Configuration loaded only if `config` is bound



## [0.1.2] - 2019-05-15

### Changed
 - Version in `package.json` to fix deployment issues



## [0.1.1] - 2019-05-15

### Added
 - Slash as explicit dependency
 - Added `@absolunet/manager` to manage package

### Changed
 - Update `@absolunet/tester` to `2.6.4`
 - Update `@absolunet/fsp` to `1.6.0`
 - Update `@absolunet/fss` to `1.6.0`
 - Update `jest` to `24.7.1`
 - Update `inquirer` to `6.3.1`
 - Update `yargs` to `13.2.2`



## [0.1.0] - 2019-05-14

### Added
 - Basic Container
 - Foundation with application
 - Bootstrapped application
 - Config module
 - Console module
 - File module
 - HTTP module
 - Security module
 - Support module




[Unreleased]:    https://github.com/absolunet/node-ioc/compare/1.0.0-alpha.1...HEAD
[1.0.0-alpha.1]: https://github.com/absolunet/node-ioc/compare/0.10.0...1.0.0-alpha.1
[0.10.0]:        https://github.com/absolunet/node-ioc/compare/0.9.0...0.10.0
[0.9.0]:         https://github.com/absolunet/node-ioc/compare/0.8.3...0.9.0
[0.8.3]:         https://github.com/absolunet/node-ioc/compare/0.8.2...0.8.3
[0.8.2]:         https://github.com/absolunet/node-ioc/compare/0.8.1...0.8.2
[0.8.1]:         https://github.com/absolunet/node-ioc/compare/0.8.0...0.8.1
[0.8.0]:         https://github.com/absolunet/node-ioc/compare/0.7.2...0.8.0
[0.7.2]:         https://github.com/absolunet/node-ioc/compare/0.7.1...0.7.2
[0.7.1]:         https://github.com/absolunet/node-ioc/compare/0.7.0...0.7.1
[0.7.0]:         https://github.com/absolunet/node-ioc/compare/0.6.2...0.7.0
[0.6.2]:         https://github.com/absolunet/node-ioc/compare/0.6.1...0.6.2
[0.6.1]:         https://github.com/absolunet/node-ioc/compare/0.6.0...0.6.1
[0.6.0]:         https://github.com/absolunet/node-ioc/compare/0.5.0...0.6.0
[0.5.0]:         https://github.com/absolunet/node-ioc/compare/0.4.4...0.5.0
[0.4.4]:         https://github.com/absolunet/node-ioc/compare/0.4.3...0.4.4
[0.4.3]:         https://github.com/absolunet/node-ioc/compare/0.4.2...0.4.3
[0.4.2]:         https://github.com/absolunet/node-ioc/compare/0.4.1...0.4.2
[0.4.1]:         https://github.com/absolunet/node-ioc/compare/0.4.0...0.4.1
[0.4.0]:         https://github.com/absolunet/node-ioc/compare/0.3.1...0.4.0
[0.3.1]:         https://github.com/absolunet/node-ioc/compare/0.3.0...0.3.1
[0.3.0]:         https://github.com/absolunet/node-ioc/compare/0.2.0...0.3.0
[0.2.0]:         https://github.com/absolunet/node-ioc/compare/0.1.2...0.2.0
[0.1.2]:         https://github.com/absolunet/node-ioc/compare/0.1.1...0.1.1
[0.1.1]:         https://github.com/absolunet/node-ioc/compare/0.1.0...0.1.1
[0.1.0]:         https://github.com/absolunet/node-ioc/releases/tag/0.1.0