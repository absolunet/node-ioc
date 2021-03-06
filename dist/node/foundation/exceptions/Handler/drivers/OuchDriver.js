"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Driver = _interopRequireDefault(require("./Driver"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Foundation - Exceptions - Handler - Drivers - Ouch Driver
//--------------------------------------------------------

/**
 * Ouch exception render driver.
 *
 * @memberof foundation.exceptions.Handler.drivers
 * @augments foundation.exceptions.Handler.drivers.Driver
 */
class OuchDriver extends _Driver.default {
  /**
   * Class dependencies: <code>['app']</code>.
   *
   * @type {Array<string>}
   */
  static get dependencies() {
    return (super.dependencies || []).concat(['app', 'ide.link']);
  }
  /**
   * @inheritdoc
   * @private
   */


  init() {
    const {
      Ouch
    } = this;
    this.setEngine(new Ouch([]));
  }
  /**
   * @inheritdoc
   */


  async render(exception, request, response) {
    const {
      Ouch
    } = this;
    const wantsJson = this.wantsJson(request);

    if (wantsJson) {
      this.engine.pushHandler(new Ouch.handlers.JsonResponseHandler(undefined, true, false));
    } else {
      const editor = this.app.isBound('config') ? this.app.make('config').get('dev.ide') : null;
      const prettyPageHandler = new Ouch.handlers.PrettyPageHandler('blue', undefined, editor || undefined);
      this.ideLink.entries().forEach(([ide, link]) => {
        prettyPageHandler.addEditor(ide.toLowerCase(), link);
      });
      this.engine.pushHandler(prettyPageHandler);
    }

    await new Promise(resolve => {
      this.engine.handleException(exception, request, response, output => {
        if (wantsJson) {
          this.sendJsonResponse(exception, request, response, output);
        }

        resolve();
      });
    });
    this.engine.clearHandlers();
  }
  /**
   * Send JSON response based on given output.
   *
   * @param {Error|string} exception - The exception to render.
   * @param {request} request - The current request instance.
   * @param {response} response - The current response instance.
   * @param {Array<string>} output - The JsonResponseHandler output.
   */


  sendJsonResponse(exception, request, response, output) {
    let data;

    try {
      data = JSON.parse(output[0]);
    } catch (error) {
      data = this.renderJson(exception);
    }

    if (!this.app.isBound('config') || !this.app.make('config').get('app.debug', false)) {
      const {
        type,
        message
      } = data;
      data = {
        type,
        message
      };
    }

    response.json(data);
  }
  /**
   * The ouch module.
   *
   * @type {Ouch}
   */


  get Ouch() {
    return require('ouch'); // eslint-disable-line global-require
  }

}

var _default = OuchDriver;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;