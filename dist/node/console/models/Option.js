"use strict";

exports.default = void 0;

var _Argument = _interopRequireDefault(require("./Argument"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Console - Option
//--------------------------------------------------------

/**
 * Option argument class.
 * Represents a string option that look like "some:command --option=value" in a command.
 *
 * @memberof console.models
 * @augments console.models.Argument
 */
class Option extends _Argument.default {}

var _default = Option;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;