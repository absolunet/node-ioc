//--------------------------------------------------------
//-- Node IoC - View - Services - Factory
//--------------------------------------------------------
'use strict';


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
		return this.viewEngine.render(this.viewResolver.find(view), data);
	}

}

module.exports = Factory;
