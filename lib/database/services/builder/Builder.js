//--------------------------------------------------------
//-- Node IoC - Database - Services - Builder
//--------------------------------------------------------
'use strict';


const __ = require('@absolunet/private-registry');
const BuilderProxy = require('./BuilderProxy');


class Builder {

	static get dependencies() {
		return ['db.connection'];
	}

	constructor() {
		return new Proxy(this, new BuilderProxy());
	}

	getConnection(connection = 'default') {
		return this.connector.driver(connection).getConnection();
	}

	newConnection(data = {}) {
		const { driver } = data;

		return this.connector.driver(driver).newConnection(data);
	}

	get connector() {
		return this.dbConnection;
	}

}

module.exports = Builder;
