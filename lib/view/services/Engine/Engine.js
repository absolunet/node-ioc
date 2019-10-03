//--------------------------------------------------------
//-- Node IoC - View - Services - Engine
//--------------------------------------------------------
'use strict';

const hasDriver      = require('../../../support/mixins/hasDriver');
const JsRenderDriver = require('./drivers/JsRenderDriver');
const NullDriver     = require('./drivers/NullDriver');


class Engine extends hasDriver() {

	/**
	 * {@inheritdoc}
	 */
	init() {
		super.init();
		this.addDriver('jsrender', JsRenderDriver);
		this.addDriver('null', NullDriver);
		this.setDefaultDriver('jsrender');
	}

	/**
	 * Make a template instance by name.
	 *
	 * @param {string} view
	 * @returns {template}
	 */
	make(view) {
		return this.driver().make(view);
	}

	/**
	 * Render a template by name.
	 *
	 * @param {string} view
	 * @param {*} [data]
	 * @returns {string}
	 */
	render(view, data = {}) {
		return this.driver().render(view, data);
	}


}


module.exports = Engine;
