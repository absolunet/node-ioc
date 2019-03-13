//--------------------------------------------------------
//-- Node IoC - Config - JavaScript Driver
//--------------------------------------------------------
'use strict';


const __ = require('@absolunet/private-registry');
const Driver = require('./Driver');


class JavaScriptDriver extends Driver {

	static get dependencies() {
		return ['app'];
	}

	/**
	 * JavaScriptDriver constructor.
	 *
	 * @param {Application} app
	 */
	constructor(app) {
		super();
		__(this).set('app', app);
	}

	/**
	 * {@inheritdoc}
	 */
	load(file) {
		return __(this).get('app').getContext().require(file);
	}

	/**
	 * {@inheritdoc}
	 */
	loadAsync(file) {
		return Promise.resolve(__(this).get('app').getContext().require(file));
	}

}

module.exports = JavaScriptDriver;
