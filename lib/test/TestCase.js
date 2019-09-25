//--------------------------------------------------------
//-- Node IoC - Test - Test Case
//--------------------------------------------------------
'use strict';


const __        = require('@absolunet/private-registry');
const hasEngine = require('../support/mixins/hasEngine');
const asserts   = require('./mixins/core/asserts');
const expects   = require('./mixins/core/expects');
const setsUp    = require('./mixins/core/setsUp');


class TestCase extends setsUp(expects(asserts(hasEngine()))) {

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
	 * Expect given abstract to be bound in the application.
	 *
	 * @param {string} abstract
	 */
	expectBound(abstract) {
		this.expect(this.app.isBound(abstract)).toBe(true);
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
