"use strict";

exports.default = void 0;

var _GenericClass = _interopRequireDefault(require("./GenericClass"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- IoC - Foundation - Mixins - Concerns - Define mixin
//--------------------------------------------------------

/**
 * Mixin factory.
 *
 * @param {Function} callback - Mixin closure.
 * @returns {Function} Mixin.
 * @memberof support.mixins.concerns
 */
const factory = callback => {
  return (SuperClass = _GenericClass.default) => {
    return callback(SuperClass);
  };
};

var _default = factory;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;