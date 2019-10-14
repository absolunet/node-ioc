//--------------------------------------------------------
//-- Node IoC - View - Services - Engine
//--------------------------------------------------------
'use strict';

const hasDriver      = require('../../../support/mixins/hasDriver');
const JsRenderDriver = require('./drivers/JsRenderDriver');
const NullDriver     = require('./drivers/NullDriver');


/**
 * View engine that uses driver to make and render templates.
 *
 * @memberof view.services
 * @augments support.mixins.HasDriver
 * @hideconstructor
 */
class Engine extends hasDriver() {

	/**
	 * Class dependencies.
	 *
	 * @type {Array<string>}
	 */
	static get dependencies() {
		return (super.dependencies || []).concat(['config']);
	}

	/**
	 * @inheritdoc
	 * @private
	 */
	init() {
		super.init();
		this.addDriver('jsrender', JsRenderDriver);
		this.addDriver('null', NullDriver);
		this.setDefaultDriver(this.config.get('view.engine', 'jsrender'));
	}

	/**
	 * Make a template instance by name.
	 *
	 * @param {string} view - The view name.
	 * @returns {template} - The template instance.
	 */
	make(view) {
		return this.driver().make(view);
	}

	/**
	 * Render a template by name.
	 *
	 * @param {string} view - The view name.
	 * @param {*} [data] - The view-model data.
	 * @returns {string} - The rendered template.
	 */
	render(view, data = {}) {
		return this.driver().render(view, data);
	}


}


module.exports = Engine;
