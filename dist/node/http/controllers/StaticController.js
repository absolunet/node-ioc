//--------------------------------------------------------
//-- Node IoC - HTTP - Controllers - Default Controller
//--------------------------------------------------------
'use strict';

const Controller = require('./Controller');
/**
 * Controller that handle static content response.
 *
 * @memberof http.controllers
 * @augments http.controllers.Controller
 * @hideconstructor
 */


class StaticController extends Controller {
  /**
   * Class dependencies.
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
   * @returns {response} - The current response instance.
   */


  handle({
    folder
  }) {
    const {
      file
    } = this.request.params;
    const fullPath = this.app.formatPath(folder, file);

    if (!this.file.exists(fullPath)) {
      return this.notFound().response;
    }

    return this.response.sendFile(fullPath);
  }

}

module.exports = StaticController;