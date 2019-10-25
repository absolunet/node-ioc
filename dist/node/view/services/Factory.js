"use strict";

exports.default = void 0;

//--------------------------------------------------------
//-- Node IoC - View - Services - Factory
//--------------------------------------------------------

/**
 * View factory that generate a fully rendered template as string from view paths and view-model.
 *
 * @memberof view.services
 * @hideconstructor
 */
class Factory {
  /**
   * Class dependencies: <code>['view.resolver', 'view.engine']</code>.
   *
   * @type {Array<string>}
   */
  static get dependencies() {
    return ['view.resolver', 'view.engine'];
  }
  /**
   * Create a rendered template from a view name and data.
   *
   * @param {string} view - The view name.
   * @param {*} data - The view-model data.
   * @returns {string} The rendered view template.
   */


  make(view, data = {}) {
    return this.viewEngine.render(this.viewResolver.find(view), data);
  }

}

var _default = Factory;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;