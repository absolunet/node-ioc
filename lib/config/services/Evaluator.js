//--------------------------------------------------------
//-- Node IoC - Config - Evaluator
//--------------------------------------------------------
'use strict';


class Evaluator {

	/**
	 * Safely evaluate primitive type.
	 *
	 * @param {*} value
	 * @returns {string|null|boolean|number}
	 */
	evaluate(value) {
		if ([null, 'null'].includes(value) || typeof value === 'undefined' || value === 'undefined') {
			return null;
		}

		if (!['string', 'boolean', 'number', 'bigint'].includes(typeof value)) {
			return value;
		}

		if ([true, false, true.toString(), false.toString()].includes(value)) {
			return value.toString() === true.toString();
		}

		if ((isNaN(value) && typeof value === 'number') || value === 'NaN') {
			return NaN;
		}

		if (!isNaN(value) && value !== '') {
			return parseFloat(value);
		}

		return value;
	}

}


module.exports = Evaluator;
