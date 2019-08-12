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
	 * Configured paths for the database files.
	 *
	 * @type {{factories: string, models: string, migrations: string, seeds: string}}
	 */
	get paths() {
		const configuredPaths = this.config.get('database.paths', {});

		return [...new Set([...Object.keys(configuredPaths), 'factories', 'models', 'migrations', 'seeds'])]
			.reduce((paths, type) => {
				paths[type] = this.grammar.format(paths[type] || `@/database/${type}`);

				return paths;
			}, configuredPaths);
	}

	/**
	 * @type {Grammar}
	 */
	get grammar() {
		return __(this).get('config.grammar');
	}

}


module.exports = Resolver;
