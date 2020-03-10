"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Enum = _interopRequireDefault(require("../Enum"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Support - Enums - IDE Link
//--------------------------------------------------------

/**
 * IDE link enum.
 *
 * @memberof support.enums
 * @augments support.Enum
 * @hideconstructor
 */
class IdeLink extends _Enum.default {
  /**
   * Atom link.
   *
   * @type {string}
   */
  get ATOM() {
    return 'atom://core/open/file?filename=%file&line=%line';
  }
  /**
   * Emacs link.
   *
   * @type {string}
   */


  get EMACS() {
    return 'emacs://open?url=file://%file&line=%line';
  }
  /**
   * Espresso link.
   *
   * @type {string}
   */


  get ESPRESSO() {
    return 'x-espresso://open?filepath=%file&lines=%line';
  }
  /**
   * IDEA link.
   *
   * @type {string}
   */


  get IDEA() {
    return 'idea://open?file=%file&line=%line';
  }
  /**
   * Mac VIM link.
   *
   * @type {string}
   */


  get MACVIM() {
    return 'mvim://open/?url=file://%file&line=%line';
  }
  /**
   * PHPStorm link.
   *
   * @type {string}
   */


  get PHPSTORM() {
    return 'phpstorm://open?file=%file&line=%line';
  }
  /**
   * Sublime link.
   *
   * @type {string}
   */


  get SUBLIME() {
    return 'subl://open?url=file://%file&line=%line';
  }
  /**
   * TextMate link.
   *
   * @type {string}
   */


  get TEXTMATE() {
    return 'txmt://open?url=file://%file&line=%line';
  }
  /**
   * VS Code link.
   *
   * @type {string}
   */


  get VSCODE() {
    return 'vscode://file/%file:%line';
  }

}

var _default = IdeLink;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;