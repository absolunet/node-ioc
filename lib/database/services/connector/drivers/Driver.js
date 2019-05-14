//--------------------------------------------------------
//-- Node IoC - Database - Connector - Driver
//--------------------------------------------------------
'use strict';


const __ = require('@absolunet/private-registry');
const knex = require('knex');


class Driver {

	static get dependencies() {
		return ['config'];
	}

	getConnection() {
		const { defaultConnection } = this;

		if (!defaultConnection) {
			throw new Error('No default connection was configured.');
		}

		return defaultConnection;
	}

	setDefaultConnection(config) {
		__(this).set('default', this.newConnection(config));
	}

	newConnection(config) {
		return knex(this.mapConfig(config));
	}

	mapConfig(config) {
		return {
			client: this.client,
			connection: config
		};
	}

	get config() {
		return __(this).get('config');
	}

	get defaultConnection() {
		return __(this).get('default');
	}

}

module.exports = Driver;
