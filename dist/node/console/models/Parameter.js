//--------------------------------------------------------
//-- Node IoC - Console - Parameter
//--------------------------------------------------------
'use strict';

const Argument = require('./Argument');
/**
 * Parameter argument class.
 * Represents a string value that look like "some:command argument" in a command.
 *
 * @memberof console.models
 * @augments console.models.Argument
 */


class Parameter extends Argument {
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

module.exports = Parameter;