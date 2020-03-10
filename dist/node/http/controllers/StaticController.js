"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Controller = _interopRequireDefault(require("./Controller"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - HTTP - Controllers - Default Controller
//--------------------------------------------------------

/**
 * Controller that handle static content response.
 *
 * @memberof http.controllers
 * @augments http.controllers.Controller
 * @hideconstructor
 */
class StaticController extends _Controller.default {
  /**
   * Class dependencies: <code>['file']</code>.
   *
   * @type {Array<string>}
   */
  static get dependencies() {
    return (super.dependencies || []).concat(['file']);
  }
  /**
   * Handle redirection.
   *
   * @param {{folder: string}} defaults - The default values.
   * @returns {*} The response.
   */


  handle({
    folder
  }) {
    const {
      file
    } = this.request.params;
    const fullPath = this.app.formatPath(folder, file);

    if (!this.file.exists(fullPath)) {
      return this.notFound();
    }

    return this.response.sendFile(fullPath);
  }

}

var _default = StaticController;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;