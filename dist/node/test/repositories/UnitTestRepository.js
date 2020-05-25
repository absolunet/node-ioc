"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _TestRepository = _interopRequireDefault(require("./TestRepository"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Test - Repository - Unit Test repository
//--------------------------------------------------------

/**
 * Unit test repository that scopes to the "unit" folder.
 *
 * @memberof test.repositories
 * @augments test.repositories.TestRepository
 * @hideconstructor
 */
class UnitTestRepository extends _TestRepository.default {
  /**
   * @inheritdoc
   */
  get scope() {
    return 'unit';
  }

}

var _default = UnitTestRepository;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;