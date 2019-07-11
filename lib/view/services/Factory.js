//--------------------------------------------------------
//-- Node IoC - View - Services - Factory
//--------------------------------------------------------
'use strict';

const __  = require('@absolunet/private-registry');


class Factory {

	/**
	 * {@inheritdoc}
	 */
	static get dependencies() {
		return ['view.resolver', 'view.engine'];
	}

	/**
	 * Create a rendered template from a view name and data.
	 *
	 * @param {string} view
	 * @param {*} data
	 * @returns {string}
	 */
	make(view, data = {}) {
		return this.engine.render(this.resolver.find(view), data);
	}

	/**
	 * @type {Resolver}
	 */
	get resolver() {
		return __(this).get('view.resolver');
	}

	/**
	 * @returns {Engine}
	 */
	get engine() {
		return __(this).get('view.engine');
	}

}

module.exports = Factory;
