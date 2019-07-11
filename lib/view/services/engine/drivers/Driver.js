//--------------------------------------------------------
//-- Node IoC - View - Services - Drivers - Driver
//--------------------------------------------------------
'use strict';


class Driver {

	/**
	 * Create a template instance.
	 *
	 * @param {string} view
	 * @returns {*}
	 */
	make() {
		throw new TypeError('Method render() must be implemented.');
	}

	/**
	 * Render a template with the given data.
	 *
	 * @param {string} view
	 * @param {*} data
	 * @returns {string}
	 */
	render() {
		throw new TypeError('Method render() must be implemented.');
	}

}

module.exports = Driver;
