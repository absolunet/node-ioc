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
		if ([null, 'null'].includes(value) || typeof value === 'undefined') {
			return null;
		}

		if ([true, false, true.toString(), false.toString()].includes(value)) {
			return value.toString() === true.toString();
		}

		if (!isNaN(value) && value !== '') {
			return parseFloat(value);
		}

		return value;
	}

}


module.exports = Evaluator;
