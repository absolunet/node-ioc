//--------------------------------------------------------
//-- Node IoC - View - Services - Drivers - Driver
//--------------------------------------------------------

import hasEngine           from '../../../../support/mixins/hasEngine';
import NotImplementedError from '../../../../foundation/exceptions/NotImplementedError';

/* istanbul ignore next */
/**
 * Abstract driver that defines the basic interface for a view engine driver.
 *
 * @memberof view.services.Engine.drivers
 * @augments support.mixins.HasEngine
 * @abstract
 * @hideconstructor
 */
class Driver extends hasEngine() {

	/**
	 * Create a template instance.
	 *
	 * @param {string} view - The view name.
	 * @returns {template} The template instance.
	 * @abstract
	 */
	make(view) { // eslint-disable-line no-unused-vars
		throw new NotImplementedError(this, 'make');
	}

	/**
	 * Render a template with the given data.
	 *
	 * @param {string} view - The view name.
	 * @param {*} data - The view-model data.
	 * @returns {string} The rendered template as string.
	 * @abstract
	 */
	render(view, data) { // eslint-disable-line no-unused-vars
		throw new NotImplementedError(this, 'render');
	}

}


export default Driver;
