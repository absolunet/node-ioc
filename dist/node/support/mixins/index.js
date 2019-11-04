"use strict";

exports.default = void 0;

var _mixinFactory = _interopRequireDefault(require("./concerns/mixinFactory"));

var _checksTypes = _interopRequireDefault(require("./checksTypes"));

var _forwardsCalls = _interopRequireDefault(require("./forwardsCalls"));

var _getsMethods = _interopRequireDefault(require("./getsMethods"));

var _hasDriver = _interopRequireDefault(require("./hasDriver"));

var _hasEngine = _interopRequireDefault(require("./hasEngine"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- IoC - Foundation - Mixins
//--------------------------------------------------------

/* istanbul ignore next */
const mixins = {
  checksTypes: _checksTypes.default,
  forwardsCalls: _forwardsCalls.default,
  getsMethods: _getsMethods.default,
  hasDriver: _hasDriver.default,
  hasEngine: _hasEngine.default
};

mixins.factory = (name, callback) => {
  mixins[name] = (0, _mixinFactory.default)(callback);
};

var _default = mixins;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;