//--------------------------------------------------------
//-- Node IoC - Test - Abstract - Test Case
//--------------------------------------------------------
'use strict';


const __ = require('@absolunet/private-registry');
const BaseTestCase = require('./BaseTestCase');


class TestCase extends BaseTestCase {

	/**
	 * Call make method from the current application.
	 *
	 * @param {*} abstract
	 * @param {{[string]:*}} parameters
	 * @returns {*}
	 */
	make(abstract, parameters = {}) {
		return this.app.make(abstract, parameters);
	}

	/**
	 * Set current application.
	 *
	 * @param {Container} app
	 * @returns {TestCase}
	 */
	setApp(app) {
		__(this).set('app', app);

		return this;
	}

	/**
	 * Current application accessor.
	 *
	 * @returns {Container}
	 */
	get app() {
		return __(this).get('app');
	}

}

module.exports = TestCase;
