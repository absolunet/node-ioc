"use strict";

exports.default = void 0;

var _hasDriver = _interopRequireDefault(require("../../../support/mixins/hasDriver"));

var _JsRenderDriver = _interopRequireDefault(require("./drivers/JsRenderDriver"));

var _NullDriver = _interopRequireDefault(require("./drivers/NullDriver"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - View - Services - Engine
//--------------------------------------------------------

/**
 * View engine that uses driver to make and render templates.
 *
 * @memberof view.services
 * @augments support.mixins.HasDriver
 * @hideconstructor
 */
class Engine extends (0, _hasDriver.default)() {
  /**
   * Class dependencies: <code>['app', 'config']</code>.
   *
   * @type {Array<string>}
   */
  static get dependencies() {
    return (super.dependencies || []).concat(['config']);
  }
  /**
   * @inheritdoc
   * @private
   */


  init() {
    super.init();
    this.addDriver('jsrender', _JsRenderDriver.default);
    this.addDriver('null', _NullDriver.default);
    this.setDefaultDriver(this.config.get('view.engine', 'jsrender'));
  }
  /**
   * Make a template instance by name.
   *
   * @param {string} view - The view name.
   * @returns {template} - The template instance.
   */


  make(view) {
    return this.driver().make(view);
  }
  /**
   * Render a template by name.
   *
   * @param {string} view - The view name.
   * @param {*} [data] - The view-model data.
   * @returns {string} - The rendered template.
   */


  render(view, data = {}) {
    return this.driver().render(view, data);
  }

}

var _default = Engine;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;