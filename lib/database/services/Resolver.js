//--------------------------------------------------------
//-- Node IoC - Database - Services - Resolver
//--------------------------------------------------------
'use strict';

const __ = require('@absolunet/private-registry');


class Resolver {

	/**
	 * {@inheritdoc}
	 */
	static get dependencies() {
		return ['app', 'config', 'config.grammar', 'helper.string'];
	}

	/**
	 * {@inheritdoc}
	 */
	init() {
		this.bindPaths();
	}

	/**
	 * Get configured paths for the database files.
	 *
	 * @return {{factories: string, models: string, migrations: string, seeds: string}}
	 */
	resolvePaths() {
		const configuredPaths = this.config.get('database.paths', {});

		const pathKeys = [...new Set([...Object.keys(configuredPaths), 'factories', 'models', 'migrations', 'seeds'])];

		return pathKeys.reduce((paths, type) => {
			paths[type] = this.grammar.format(paths[type] || `@/database/${type}`);

			return paths;
		}, configuredPaths);
	}

	/**
	 * Get specific database files path.
	 *
	 * @returns {string}
	 */
	resolvePath(name) {
		return this.resolvePaths()[name];
	}

	/**
	 * Bind paths into application.
	 * This will bind "path.factory", "path.model", "path.migration" and "path.seed" and other
	 * configured path within "database.paths" configuration.
	 * The path keys will be converted to their singular form.
	 */
	bindPaths() {
		Object.entries(this.resolvePaths()).forEach(([key, value]) => {
			const name = this.stringHelper.singular(key);
			this.app.configurePaths({ [name]: value });
		});
	}

	/**
	 * @type {ConfigGrammar}
	 */
	get grammar() {
		return __(this).get('config.grammar');
	}

	/**
	 * @type {StringHelper}
	 */
	get stringHelper() {
		return __(this).get('helper.string');
	}

}


module.exports = Resolver;
