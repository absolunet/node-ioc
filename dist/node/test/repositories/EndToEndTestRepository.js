"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _TestRepository = _interopRequireDefault(require("./TestRepository"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Test - Repository - End To End Test repository
//--------------------------------------------------------

/**
 * End to end test repository that scopes to the "e2e" folder.
 *
 * @memberof test.repositories
 * @augments test.repositories.TestRepository
 * @hideconstructor
 */
class EndToEndTestRepository extends _TestRepository.default {
  /**
   * @inheritdoc
   */
  get scope() {
    return 'endtoend';
  }

}

var _default = EndToEndTestRepository;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;