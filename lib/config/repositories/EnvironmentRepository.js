//--------------------------------------------------------
//-- Node IoC - Config - Config Grammar
//--------------------------------------------------------
'use strict';

const __     = require('@absolunet/private-registry');
const dotenv = require('dotenv');
const path   = require('path');


class EnvironmentRepository {

	/**
	 * {@inheritdoc}
	 */
	static get dependencies() {
		return ['app', 'evaluator'];
	}

	/**
	 * {@inheritdoc}
	 */
	init() {
		this.setFromFile(path.join(this.app.make('path.base'), '.env'));
	}

	/**
	 * Set environment values from given file.
	 *
	 * @param {string} file
	 */
	setFromFile(file) {
		const { error } = dotenv.config({ path: file });

		__(this).set('env', error ? {} : process.env); // eslint-disable-line no-process-env
	}

	/**
	 * Get all loaded environment variables.
	 *
	 * @returns {*}
	 */
	all() {
		return __(this).get('env') || {};
	}

	/**
	 * Get single environment variable.
	 * Value will be automatically cast as null, a boolean, a number or a string.
	 * The first valid value will be returned.
	 *
	 * @param {string} key
	 * @param {null|boolean|number|string}[defaultValue]
	 * @returns {boolean|null|number|string}
	 */
	get(key, defaultValue = null) {
		if (!this.has(key)) {
			return defaultValue;
		}

		return this.evaluator.evaluate(this.all()[key]);
	}

	/**
	 * Check if environment variable was defined.
	 *
	 * @param {string} key
	 * @returns {boolean}
	 */
	has(key) {
		return Object.prototype.hasOwnProperty.call(this.all(), key);
	}

}


module.exports = EnvironmentRepository;
