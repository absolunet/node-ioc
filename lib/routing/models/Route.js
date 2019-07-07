//--------------------------------------------------------
//-- Node IoC - Routing - Models - Route
//--------------------------------------------------------
'use strict';

const Model = require('./../../foundation/data/Model');


class Route extends Model {

	/**
	 * Route constructor.
	 */
	constructor(...parameters) {
		const model = super(...parameters);
		this.as = '';
		this.constraints = {};
		this.defaults = {};

		return model;
	}

	/**
	 * Name the route.
	 *
	 * @param {string} name
	 * @returns {Route}
	 */
	name(name) {
		this.as = `${this.asPrefix || ''}${name}`;

		return this;
	}

	/**
	 * Add a constraint to URL parameter.
	 * Can either be a constraint object or two parameters, key and value.
	 *
	 * @param {string|object} constraints
	 * @returns {*}
	 */
	where(...constraints) {
		return this.merge('constraints', constraints);
	}

	/**
	 * Give static values to the controller when the route is resolved.
	 *
	 * Can either be a constraint object or two parameters, key and value.
	 *
	 * @param {string|object} defaults
	 * @returns {*}
	 */
	with(...defaults) {
		return this.merge('defaults', defaults);
	}

	/**
	 * Merge given value in route attributes.
	 *
	 * @param {string} key
	 * @param {Array<string|object>} values
	 * @returns {Route}
	 */
	merge(key, values) {
		let data;

		if (values.length === 1 && typeof values[0] === 'object') {
			[data] = values;
		} else {
			data = { [values[0]]: values[1] };
		}

		Object.assign(this[key], data);

		return this;
	}

}

module.exports = Route;
