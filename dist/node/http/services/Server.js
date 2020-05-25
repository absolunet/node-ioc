"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _privateRegistry = _interopRequireDefault(require("@absolunet/private-registry"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - HTTP - Services - Server
//--------------------------------------------------------

/**
 * HTTP server class that decorates Express server and router.
 *
 * @memberof http.services
 * @hideconstructor
 */
class Server {
  /**
   * Make a new server instance.
   *
   * @param {boolean} [unique=false] - Indicates that the servers hould be a unique one and not set as a singleton.
   * @returns {Express} Newly created Express server instance.
   */
  make(unique = false) {
    const server = this.applyMiddleware(this.express());

    if (!this.hasInstance() && !unique) {
      this.setDefaultInstance(server);
    }

    return server;
  }
  /**
   * Get an existing server instance if exists or a fresh one otherwise.
   *
   * @returns {Express} Existing or newly created Express server instance.
   */


  getInstance() {
    return this.hasInstance() ? (0, _privateRegistry.default)(this).get('instance') : this.make();
  }
  /**
   * Set default server instance.
   *
   * @param {Express} server - The Express server instance.
   * @returns {http.services.Server} The current server instance.
   */


  setDefaultInstance(server) {
    (0, _privateRegistry.default)(this).set('instance', server);
    return this;
  }
  /**
   * Check if an instance already exists.
   *
   * @returns {boolean} Indicates that an Express server was already instantiated.
   */


  hasInstance() {
    return Boolean((0, _privateRegistry.default)(this).get('instance'));
  }
  /**
   * Get Express router.
   *
   * @returns {express.Router} Express router instance.
   */


  getRouter() {
    return this.express.Router();
  }
  /**
   * Apply middleware to given server instance.
   *
   * @param {Express} server - Express server instance.
   * @returns {Express} Express server instance with applied middleware.
   */


  applyMiddleware(server) {
    require('run-middleware')(server); // eslint-disable-line global-require


    server.use(this.express.json());
    server.use(this.express.urlencoded({
      extended: true
    }));
    server.use(this.methodOverride(this.methodOverrideParser));
    return server;
  }
  /**
   * Method override parser callback accessor.
   *
   * @type {Function}
   */


  get methodOverrideParser() {
    return request => {
      if (request.body && typeof request.body === 'object' && '_method' in request.body) {
        const {
          _method: method
        } = request.body;
        delete request.body._method;
        return method.toUpperCase();
      }

      return request.method;
    };
  }
  /**
   * The method-override module.
   *
   * @type {Function}
   */


  get methodOverride() {
    return require('method-override'); // eslint-disable-line global-require
  }
  /**
   * The Express module.
   *
   * @type {Express}
   */


  get express() {
    return require('express'); // eslint-disable-line global-require
  }

}

var _default = Server;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;