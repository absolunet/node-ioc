"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Argument = _interopRequireDefault(require("./Argument"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Console - Flag
//--------------------------------------------------------

/**
 * Flag argument class.
 * Represents a boolean option that look like "some:command --flag" in a command.
 *
 * @memberof console.models
 * @augments console.models.Argument
 */
class Flag extends _Argument.default {
  /**
   * Flag constructor.
   *
   * @param {string} name - The name.
   * @param {string} description - The description for CLI help.
   * @param {string|null} alias - The flag alias.
   */
  constructor(name, description = '', alias = null) {
    super(name, false, description, alias);
    this.value = false;
  }
  /**
   * @inheritdoc
   */


  get yargsModel() {
    const model = super.yargsModel;
    model.type = 'boolean';
    delete model.default;
    return model;
  }

}

var _default = Flag;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;