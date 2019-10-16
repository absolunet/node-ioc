"use strict";

exports.default = void 0;

var _Argument = _interopRequireDefault(require("./Argument"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Console - Parameter
//--------------------------------------------------------

/**
 * Parameter argument class.
 * Represents a string value that look like "some:command argument" in a command.
 *
 * @memberof console.models
 * @augments console.models.Argument
 */
class Parameter extends _Argument.default {
  /**
   * Parameter constructor.
   *
   * @param {string} name - The name.
   * @param {boolean} required - Indicates that the parameter is required.
   * @param {*|null} defaultValue - The default value.
   * @param {string} description - The description for CLI help.
   */
  constructor(name, required = true, defaultValue = null, description = '') {
    super(name, defaultValue, description);
    this.required = required;
  }
  /**
   * Parameter signature.
   *
   * @type {string}
   */


  get signature() {
    if (this.required) {
      return `<${this.name}>`;
    }

    return `[${this.name}]`;
  }

}

var _default = Parameter;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;