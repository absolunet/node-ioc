//--------------------------------------------------------
//-- Node IoC - View - Services - Drivers - Driver
//--------------------------------------------------------
'use strict';

const hasEngine           = require('../../../../support/mixins/hasEngine');
const NotImplementedError = require('../../../../foundation/exceptions/NotImplementedError');

/* istanbul ignore next */
class Driver extends hasEngine() {

	/**
	 * Create a template instance.
	 *
	 * @param {string} view
	 * @returns {*}
	 */
	make() {
		throw new NotImplementedError(this, 'make');
	}

	/**
	 * Render a template with the given data.
	 *
	 * @param {string} view
	 * @param {*} data
	 * @returns {string}
	 */
	render() {
		throw new NotImplementedError(this, 'render');
	}

}

module.exports = Driver;
