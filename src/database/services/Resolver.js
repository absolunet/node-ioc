//--------------------------------------------------------
//-- Node IoC - Database - Services - Resolver
//--------------------------------------------------------


/**
 * Database path resolver that links the database path configuration through the container and allows resolving without the container.
 *
 * @memberof database.services
 * @hideconstructor
 */
class Resolver {

	/**
	 * Class dependencies: <code>['app', 'config', 'config.grammar', 'helper.string']</code>.
	 *
	 * @type {Array<string>}
	 */
	static get dependencies() {
		return ['app', 'config', 'config.grammar', 'helper.string'];
	}

	/**
	 * @inheritdoc
	 * @private
	 */
	init() {
		this.bindPaths();
	}

	/**
	 * Get configured paths for the database files.
	 *
	 * @returns {{factories: string, models: string, migrations: string, seeds: string}} The paths for every database folders.
	 */
	resolvePaths() {
		const configuredPaths = { ...this.config.get('database.paths', {}) };

		const pathKeys = [...new Set([...Object.keys(configuredPaths), 'factories', 'migrations', 'models', 'seeds'])].sort();

		return pathKeys.reduce((paths, type) => {
			paths[type] = this.app.databasePath(this.configGrammar.format(paths[type] || type));

			return paths;
		}, configuredPaths);
	}

	/**
	 * Get specific database files path.
	 *
	 * @param {string} name - The database folder name.
	 * @returns {string} The requested database folder path.
	 */
	resolvePath(name) {
		return this.resolvePaths()[name];
	}

	/**
	 * Get configured source paths for the database files.
	 *
	 * @returns {{factories: string, models: string, migrations: string, seeds: string}} The paths for every database folders.
	 */
	resolveSourcePaths() {
		const configuredPaths = { ...this.config.get('database.paths', {}) };

		const pathKeys = [...new Set([...Object.keys(configuredPaths), 'factories', 'migrations', 'models', 'seeds'])].sort();

		return pathKeys.reduce((paths, type) => {
			paths[type] = this.app.sourcePath('database', this.configGrammar.format(paths[type] || type));

			return paths;
		}, configuredPaths);
	}

	/**
	 * Get specific database files source path.
	 *
	 * @param {string} name - The database folder name.
	 * @returns {string} The requested database source folder path.
	 */
	resolveSourcePath(name) {
		return this.resolveSourcePaths()[name];
	}

	/**
	 * Bind paths into application.
	 *
	 * This will bind "path.factory", "path.model", "path.migration", "path.seed" and other
	 * configured paths within "database.paths" configuration for execution.
	 *
	 * It will also bind "path.src.factory", "path.src.model", "path.src.migration", "path.src.seed" and other
	 * configured paths within "database.paths" configuration for scaffolding.
	 *
	 * The path keys will be converted to their singular form.
	 */
	bindPaths() {
		Object.entries(this.resolvePaths()).forEach(([key, value]) => {
			const name = this.stringHelper.singular(key);
			this.app.configurePaths({ [name]: value });
		});
		Object.entries(this.resolveSourcePaths()).forEach(([key, value]) => {
			const name = this.stringHelper.singular(key);
			this.app.configurePaths({ [`src.${name}`]: value });
		});
	}

	/**
	 * String helper.
	 *
	 * @type {support.helpers.StringHelper}
	 */
	get stringHelper() {
		return this.helperString;
	}

}


export default Resolver;
