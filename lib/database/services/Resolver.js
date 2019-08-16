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
		return ['config', 'config.grammar'];
	}

	/**
	 * Get configured paths for the database files.
	 *
	 * @return {{factories: string, models: string, migrations: string, seeds: string}}
	 */
	resolvePaths() {
		const configuredPaths = this.config.get('database.paths', {});

		return [...new Set([...Object.keys(configuredPaths), 'factories', 'models', 'migrations', 'seeds'])]
			.reduce((paths, type) => {
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
	 * @type {Grammar}
	 */
	get grammar() {
		return __(this).get('config.grammar');
	}

}


module.exports = Resolver;
