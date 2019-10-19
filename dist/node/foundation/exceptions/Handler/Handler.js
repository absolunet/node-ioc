"use strict";

exports.default = void 0;

var _privateRegistry = _interopRequireDefault(require("@absolunet/private-registry"));

var _hasDriver = _interopRequireDefault(require("../../../support/mixins/hasDriver"));

var _OuchDriver = _interopRequireDefault(require("./drivers/OuchDriver"));

var _PrettyErrorDriver = _interopRequireDefault(require("./drivers/PrettyErrorDriver"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Foundation - Exceptions - Handler
//--------------------------------------------------------

/**
 * Main exception handler.
 *
 * @memberof foundation.exceptions
 * @augments support.mixins.HasDriver
 * @hideconstructor
 */
class Handler extends (0, _hasDriver.default)() {
  /**
   * Class dependencies: <code>['app']</code>.
   *
   * @type {Array<string>}
   */
  static get dependencies() {
    return (super.dependencies || []).concat(['app']);
  }
  /**
   * @inheritdoc
   * @private
   */


  init() {
    super.init();
    (0, _privateRegistry.default)(this).set('exceptions', []);
    this.addDriver('prettyError', _PrettyErrorDriver.default);
    this.addDriver('ouch', _OuchDriver.default);
    this.setDriverAlias('prettyError', 'console');
    this.setDriverAlias('ouch', 'http');
  }
  /**
   * Handle the given exception.
   *
   * @param {Error|string} exception - The handled exception.
   * @param {request} [request] - The current HTTP request.
   * @param {response} [response] - The current HTTP response.
   * @returns {Promise} The async process promise.
   */


  async handle(exception, request, response) {
    (0, _privateRegistry.default)(this).get('exceptions').push(exception);
    await this.report(exception);
    await this.render(exception, request, response);
  }
  /**
   * Report an exception.
   *
   * @param {Error|string} exception - The exception to report.
   * @returns {Promise} The async process promise.
   */


  async report(exception) {
    if (this.app.isBound('log')) {
      try {
        await this.app.make('log').error(exception.stack);
      } catch (error) {
        await this.handleReportException(error);
      }
    }
  }
  /**
   * Render an exception.
   *
   * @param {Error|string} exception - The handled exception.
   * @param {request} [request] - The current HTTP request.
   * @param {response} [response] - The current HTTP response.
   * @returns {Promise} The async process promise.
   */


  async render(exception, request, response) {
    if (response && response.write && response.json && response.status) {
      await this.renderResponse(exception, request, response);
    } else {
      await this.renderConsole(exception);
    }
  }
  /**
   * Render an exception as an HTTP response.
   *
   * @param {Error|string} exception - The handled exception.
   * @param {request} [request] - The current HTTP request.
   * @param {response} [response] - The current HTTP response.
   * @returns {Promise} The async process promise.
   */


  async renderResponse(exception, request, response) {
    const status = exception.status || 500;
    response.status(status);

    if (this.app.environment !== 'production') {
      await this.driver('http').render(exception, request, response);
    } else {
      let content = 'Something went wrong...';

      if (this.app.isBound('translator')) {
        content = this.app.make('translator').translate(content);
      }

      if (this.app.isBound('view') && this.app.isBound('view.resolver')) {
        const viewFactory = this.app.make('view');
        const viewResolver = this.app.make('view.resolver');
        let viewName = `errors.${status}`;

        if (!viewResolver.exists(viewName)) {
          viewName = 'errors.generic';
        }

        if (viewResolver.exists(viewName)) {
          content = viewFactory.make(viewName, {
            exception
          });
        }
      }

      response.write(content);
    }
  }
  /**
   * Render exception in console.
   *
   * @param {Error|string} exception - The handled exception.
   * @returns {Promise} The async process promise.
   */


  async renderConsole(exception) {
    await this.driver('console').render(exception);
  }
  /**
   * Handle a report exception.
   *
   * @param {Error|string} exception - The reported exception.
   * @returns {Promise} The async process promise.
   */


  async handleReportException(exception) {
    (0, _privateRegistry.default)(this).get('exceptions').push(exception);
    await this.driver('console').render(exception);
  }
  /**
   * Check if it has already handle an exception during the given request.
   *
   * @type {boolean}
   */


  get hadException() {
    return Boolean(this.lastException);
  }
  /**
   * Last exception accessor.
   *
   * @type {Error|string}
   */


  get lastException() {
    const exceptions = (0, _privateRegistry.default)(this).get('exceptions');
    return exceptions[exceptions.length - 1];
  }

}

var _default = Handler;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;