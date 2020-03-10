"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _TestRepository = _interopRequireDefault(require("./TestRepository"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Test - Repository - Feature Test repository
//--------------------------------------------------------

/**
 * Feature test repository that scopes to the "feature" folder.
 *
 * @memberof test.repositories
 * @augments test.repositories.TestRepository
 * @hideconstructor
 */
class FeatureTestRepository extends _TestRepository.default {
  /**
   * @inheritdoc
   */
  get scope() {
    return 'feature';
  }

}

var _default = FeatureTestRepository;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;