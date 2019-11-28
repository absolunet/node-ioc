"use strict";

exports.default = void 0;

var _privateRegistry = _interopRequireDefault(require("@absolunet/private-registry"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - HTTP - Controller - Controller
//--------------------------------------------------------

/**
 * Abstract controller class that defines all the shortcuts to take action on the response object.
 *
 * @memberof http.controllers
 * @abstract
 * @hideconstructor
 */
class Controller {
  /**
   * Prepare request handling.
   *
   * @param {container.Container} app - The current container instance.
   * @param {request} request - The current request instance.
   * @param {response} response - The current response instance.
   */
  prepareHandling(app, request, response) {
    (0, _privateRegistry.default)(this).set('app', app);
    (0, _privateRegistry.default)(this).set('request', request);
    (0, _privateRegistry.default)(this).set('response', response);
    (0, _privateRegistry.default)(this).set('isStreaming', false);
  }
  /**
   * Send HTML response.
   *
   * @param {string} view - The view name.
   * @param {*} data - The view-model data.
   * @returns {response} The response instance.
   */


  view(view, data = {}) {
    return this.response.type('html').send(this.app.make('view').make(view, data));
  }
  /**
   * Send JSON response.
   *
   * @param {string|number|boolean|object} object - The JSON value to send.
   * @returns {response} The response instance.
   */


  json(object) {
    return this.response.json(object);
  }
  /**
   * Dump parameters in the current response.
   *
   * @param {...*} parameters - The dumped values.
   */


  dump(...parameters) {
    this.app.make('dumper').setResponse(this.response).dump(...parameters);
  }
  /**
   * Send a stream response.
   * Ends the request when the handler resolves.
   *
   * @param {Function} handler - The stream handler.
   * @returns {Promise} The async process promise.
   */


  async stream(handler) {
    (0, _privateRegistry.default)(this).set('isStreaming', true);
    this.response.writeHead(200, {
      'Content-Type': 'text/plain',
      'Transfer-Encoding': 'chunked'
    });
    await handler();
    return this.response.end();
  }
  /**
   * Write line in the stream response.
   *
   * @param {string} line - The line to stream into the response.
   * @returns {http.controllers.Controller} The current controller instance.
   */


  writeStreamLine(line) {
    if (this.isStreaming) {
      this.response.write(`${line}\n`);
    }

    return this;
  }
  /**
   * Send a stream response from command output.
   *
   * @param {string|Array<string>} command - The command string.
   * @returns {Promise} The async process promise.
   */


  streamCommand(command) {
    const {
      writeStreamLineHandler: handler
    } = this;
    return this.stream(async () => {
      await this.runCommand(command, handler);
    });
  }
  /**
   * Run command.
   * Handle output if an handler is provided.
   *
   * @param {string|Array<string>} command - The command string.
   * @param {Function|null} [handler] - The handler that will received printed data after command will have run.
   * @returns {Promise} The async process promise.
   */


  async runCommand(command, handler = null) {
    const commandRegistrar = this.app.make('command.registrar');
    const interceptor = this.app.make('terminal.interceptor');

    if (handler) {
      interceptor.add(handler).mute();
    }

    await commandRegistrar.resolve(command, true);

    if (handler) {
      interceptor.unmute().remove(handler);
    }
  }
  /**
   * Validate the current request body against the given schema.
   *
   * @param {Function} validationClosure - The validation callback that returns the validation schema.
   */


  validate(validationClosure) {
    const validator = this.app.make('validator');
    validator.assert(this.request.body, validator.object().keys(validationClosure(validator)));
  }
  /**
   * Redirect to the given URL with the appropriate redirection code.
   *
   * @param {string} to - The URL to redirect to.
   * @param {boolean} [permanent=false] - Indicates that the redirection response should flag a permanent redirection.
   * @returns {response} The current response instance.
   */


  redirect(to, permanent = false) {
    return this.response.redirect(permanent ? 301 : 302, to);
  }
  /**
   * Redirect to the given URL permanently.
   *
   * @param {string} to - The URL to redirect to.
   * @returns {response} The current response instance.
   */


  permanentRedirect(to) {
    return this.redirect(to, true);
  }
  /**
   * Set response status.
   *
   * @param {number} status - The HTTP status code.
   * @returns {http.controllers.Controller} The current controller instance.
   */


  status(status) {
    this.response.status(status);
    return this;
  }
  /**
   * Set response status and throw an HTTP error that reflects the given status.
   *
   * @param {number} status - The HTTP status code.
   * @throws {http.exceptions.HttpError} The corresponding HTTP error based on the HTTP status code.
   */


  throwWithStatus(status) {
    this.status(status);
    throw this.app.make('http.error.mapper').getErrorInstanceFromHttpStatus(status);
  }
  /**
   * Set 200 OK status.
   *
   * @returns {http.controllers.Controller} The current controller instance.
   */


  ok() {
    return this.status(200);
  }
  /**
   * Set 201 Created status.
   *
   * @returns {http.controllers.Controller} The current controller instance.
   */


  created() {
    return this.status(201);
  }
  /**
   * Set 202 Accepted status.
   *
   * @returns {http.controllers.Controller} The current controller instance.
   */


  accepted() {
    return this.status(202);
  }
  /**
   * Set 204 No Content status.
   *
   * @returns {http.controllers.Controller} The current controller instance.
   */


  noContent() {
    this.status(204);
    this.response.end();
    return this;
  }
  /**
   * Set 400 Bad Request status.
   *
   * @returns {http.controllers.Controller} The current controller instance.
   */


  badRequest() {
    return this.throwWithStatus(400);
  }
  /**
   * Set 401 Unauthorized status.
   *
   * @returns {http.controllers.Controller} The current controller instance.
   */


  unauthorized() {
    return this.throwWithStatus(401);
  }
  /**
   * Set 403 Forbidden status.
   *
   * @returns {http.controllers.Controller} The current controller instance.
   */


  forbidden() {
    return this.throwWithStatus(403);
  }
  /**
   * Set 404 Not Found status.
   *
   * @returns {http.controllers.Controller} The current controller instance.
   */


  notFound() {
    return this.throwWithStatus(404);
  }
  /**
   * Set 405 Method Not Allowed status.
   *
   * @returns {http.controllers.Controller} The current controller instance.
   */


  methodNotAllowed() {
    return this.throwWithStatus(405);
  }
  /**
   * Set 408 Timeout status.
   *
   * @returns {http.controllers.Controller} The current controller instance.
   */


  timeout() {
    return this.throwWithStatus(408);
  }
  /**
   * Set 418 I'm A Teapot status.
   *
   * @returns {http.controllers.Controller} The current controller instance.
   */


  teapot() {
    return this.status(418);
  }
  /**
   * Command streaming interceptor handler.
   *
   * @type {Function}
   */


  get writeStreamLineHandler() {
    return content => {
      this.writeStreamLine(`${content.trim().replace(/\n$/u, '')}`);
    };
  }
  /**
   * Indicates if the response is currently streaming.
   *
   * @type {boolean}
   */


  get isStreaming() {
    return (0, _privateRegistry.default)(this).get('isStreaming');
  }
  /**
   * Container.
   *
   * @type {container.Container}
   */


  get app() {
    return (0, _privateRegistry.default)(this).get('app');
  }
  /**
   * Express request.
   *
   * @type {request}
   */


  get request() {
    return (0, _privateRegistry.default)(this).get('request');
  }
  /**
   * Express response.
   *
   * @type {response}
   */


  get response() {
    return (0, _privateRegistry.default)(this).get('response');
  }

}

var _default = Controller;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;