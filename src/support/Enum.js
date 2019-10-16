//--------------------------------------------------------
//-- Node IoC - Support - Enums
//--------------------------------------------------------

import __ from '@absolunet/private-registry';


/**
 * Base enum class that emulate the TypeScript enum feature, but by using an instantiable and injectable class instead of a plain object.
 *
 * @example
 * class SomeEnum extends Enum {
 *     get FOO() { return 'foo'; }
 *     get BAR() { return 'bar'; }
 *     get baz() { return 'baz'; }
 * }
 * const someEnum = app.make(SomeEnum); // or `new SomeEnum()`
 * someEnum.FOO; // 'foo';
 * someEnum.BAR; // 'bar';
 * someEnum.baz; // 'baz';
 * someEnum.keys(); // ['FOO', 'BAR']; // It only treats uppercase properties.
 * someEnum.values(); // ['foo', 'bar'];
 * someEnum.entries(); // [['FOO', 'foo'], ['BAR', 'bar']]
 *
 * 	@memberof support
 * 	@abstract
 * 	@hideconstructor
 */
class Enum {

	/**
	 * Enum constructor.
	 *
	 * Create dynamic properties reversing the enumerated keys and values.
	 * An enum listing foo => bar would exposes "foo" => "bar" and "bar" => "foo" afterwards.
	 */
	constructor() {
		const entries = {};
		__(this).set('entries', entries);
		Object.entries(Object.getOwnPropertyDescriptors(this.constructor.prototype)).forEach(([key, descriptor]) => {
			if (key === key.toUpperCase() && Object.prototype.hasOwnProperty.call(descriptor, 'get')) {
				const value = this[key];
				entries[key] = value;
				Object.defineProperty(this, value, {
					get: () => {
						return key;
					}
				});
			}
		});
	}

	/**
	 * Get enumeration keys.
	 *
	 * @returns {Array<string>} - The enumeration keys.
	 */
	keys() {
		return Object.keys(__(this).get('entries'));
	}

	/**
	 * Get enumeration values.
	 *
	 * @returns {Array<*>} - The enumeration values.
	 */
	values() {
		return Object.values(__(this).get('entries'));
	}

	/**
	 * Get enumeration entries.
	 *
	 * @returns {Array<Array<*>>} - The enumeration entries.
	 */
	entries() {
		return Object.entries(__(this).get('entries'));
	}

}


export default Enum;
