"use strict";

exports.default = void 0;

var _privateRegistry = _interopRequireDefault(require("@absolunet/private-registry"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Support - Enums
//--------------------------------------------------------

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
    (0, _privateRegistry.default)(this).set('entries', entries);
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
   * @returns {Array<string>} The enumeration keys.
   */


  keys() {
    return Object.keys((0, _privateRegistry.default)(this).get('entries'));
  }
  /**
   * Get enumeration values.
   *
   * @returns {Array<*>} The enumeration values.
   */


  values() {
    return Object.values((0, _privateRegistry.default)(this).get('entries'));
  }
  /**
   * Get enumeration entries.
   *
   * @returns {Array<Array<*>>} The enumeration entries.
   */


  entries() {
    return Object.entries((0, _privateRegistry.default)(this).get('entries'));
  }

}

var _default = Enum;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;