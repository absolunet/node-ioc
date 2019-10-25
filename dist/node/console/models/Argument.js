"use strict";

exports.default = void 0;

//--------------------------------------------------------
//-- Node IoC - Console - Argument
//--------------------------------------------------------

/**
 * Abstract argument class.
 *
 * @memberof console.models
 * @abstract
 */
class Argument {
  /**
   * Argument constructor.
   *
   * @param {string} name - The argument name.
   * @param {*|null} defaultValue - The default value.
   * @param {string} description - The description for CLI help.
   * @param {string|null} alias - The argument alias.
   */
  constructor(name, defaultValue = null, description = '', alias = null) {
    this.name = name;
    this.defaultValue = defaultValue;
    this.description = description || name;
    this.alias = alias;
  }
  /**
   * Get Yargs argument model.
   *
   * @type {{default: *, describe: (string|*), type: string}}
   */


  get yargsModel() {
    const model = {
      'describe': this.description,
      'type': 'string',
      'default': this.defaultValue
    };

    if (this.alias) {
      model.alias = this.alias;
    }

    return model;
  }

}

var _default = Argument;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;