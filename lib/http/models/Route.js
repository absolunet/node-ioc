//--------------------------------------------------------
//-- Node IoC - HTTP - Models - Route
//--------------------------------------------------------
'use strict';


class Route {

	/**
	 * Route constructor.
	 */
	constructor(data) {
		this.as = '';
		this.constraints = {};
		this.defaults = {};
		this.compiledPath = null;
		this.asPrefix = '';
		Object.keys(data).forEach((key) => {
			this[key] = data[key];
		});
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
	 * Compile path from given parameters.
	 *
	 * @param parameters
	 * @returns {Route}
	 */
	compilePath(parameters = {}) {
		this.compiledPath = this.path
			.replace(/:(?<name>\w+)/gu, (match, name) => {
				return parameters[name] || match;
			});

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

		this[key] = Object.assign({}, this[key] || {}, data);

		return this;
	}

}


module.exports = Route;
