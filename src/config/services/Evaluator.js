//--------------------------------------------------------
//-- Node IoC - Config - Evaluator
//--------------------------------------------------------


/**
 * Class that evaluates a value.
 * It handles undefined, null, string, boolean, number and bigint types.
 * It will evaluate if a given value should be parsed as another value.
 *
 * @example
 * evaluator.evaluate('null'); // null
 * evaluator.evaluate(null); // null
 * evaluator.evaluate('NULL'); // "NULL"
 * evaluator.evaluate('undefined'); // null
 * evaluator.evaluate(); // null
 * evaluator.evaluate('true'); // true
 * evaluator.evaluate('1.23'); // 1.23
 * evaluator.evaluate('some string'); // "some string"
 * evaluator.evaluate({ foo: 'bar' }); // { foo: "bar" }
 *
 * @memberof config.services
 * @hideconstructor
 */
class Evaluator {

	/**
	 * Safely evaluate primitive type.
	 *
	 * @param {*} value - The value to evaluate.
	 * @returns {string|null|boolean|number|*} - The evaluated value.
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


export default Evaluator;
