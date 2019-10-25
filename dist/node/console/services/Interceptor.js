"use strict";

exports.default = void 0;

var _privateRegistry = _interopRequireDefault(require("@absolunet/private-registry"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Console - Services - Interceptor
//--------------------------------------------------------

/**
 * The stdout interceptor.
 *
 * @memberof console.services
 * @hideconstructor
 */
class Interceptor {
  /**
   * Class dependencies: <code>['terminal.interceptor.capture']</code>.
   *
   * @type {Array<string>}
   */
  static get dependencies() {
    return ['terminal.interceptor.capture'];
  }
  /**
   * @inheritdoc
   * @private
   */


  init() {
    const interceptors = [];
    (0, _privateRegistry.default)(this).set('interceptors', interceptors);
    (0, _privateRegistry.default)(this).set('interceptor', content => {
      const editable = (0, _privateRegistry.default)(this).get('editable');
      const editedContent = interceptors.reduce((value, closure) => {
        const transformedValue = closure(this.styleCleaner(value));
        return editable && typeof transformedValue !== 'undefined' ? transformedValue : value;
      }, content);
      return (0, _privateRegistry.default)(this).get('mute') ? '' : editedContent;
    });
    this.enable().unmute().removeStyle().uneditable();
  }
  /**
   * Add an stdout interceptor.
   *
   * @param {Function} closure - The interceptor closure.
   * @param {number|null} [index] - The index where the interceptor should be inserted.
   * @returns {console.services.Interceptor} The Interceptor service instance.
   */


  add(closure, index = null) {
    const interceptors = (0, _privateRegistry.default)(this).get('interceptors');
    interceptors.splice(index === null ? interceptors.length : index, 0, closure);
    return this;
  }
  /**
   * Remove an stdout interceptor.
   *
   * @param {Function} closure - The interceptor closure.
   * @returns {console.services.Interceptor} The Interceptor service instance.
   */


  remove(closure) {
    const interceptors = (0, _privateRegistry.default)(this).get('interceptors');

    if (interceptors.includes(closure)) {
      interceptors.splice(interceptors.indexOf(closure), 1);
    }

    return this;
  }
  /**
   * Remove all existing interceptors.
   *
   * @returns {console.services.Interceptor} The Interceptor service instance.
   */


  removeAll() {
    (0, _privateRegistry.default)(this).get('interceptors').splice(0);
    return this;
  }
  /**
   * Start capture.
   *
   * @param {boolean} [mute=true] - Indicates if the console should be muted.
   * @returns {console.services.Interceptor} The Interceptor service instance.
   */


  startCapture(mute = true) {
    const {
      captureInterceptor
    } = this;
    captureInterceptor.flush();
    this.add(captureInterceptor.handler);

    if (mute) {
      this.mute();
    }

    return this;
  }
  /**
   * Stop capture and get the output.
   *
   * @param {boolean} [unmute=true] - Indicates if the console should be unmuted.
   * @returns {Array<string>} The captured data.
   */


  stopCapture(unmute = true) {
    this.remove(this.captureInterceptor.handler);

    if (unmute) {
      this.unmute();
    }

    return this.output;
  }
  /**
   * Enable interceptors.
   *
   * @returns {console.services.Interceptor} The Interceptor service instance.
   */


  enable() {
    if (!(0, _privateRegistry.default)(this).get('disable')) {
      (0, _privateRegistry.default)(this).set('disable', this.interceptStdout(content => {
        return (0, _privateRegistry.default)(this).get('interceptor')(content);
      }));
    }

    return this;
  }
  /**
   * Disable interceptors.
   *
   * @returns {console.services.Interceptor} The Interceptor service instance.
   */


  disable() {
    const disable = (0, _privateRegistry.default)(this).get('disable');

    if (disable) {
      disable();
      (0, _privateRegistry.default)(this).set('disable', undefined);
    }

    return this;
  }
  /**
   * Mute stdout in process but keep interceptors enabled.
   *
   * @param {boolean} [state=true] - Indicates the mute state.
   * @returns {console.services.Interceptor} The Interceptor service instance.
   */


  mute(state = true) {
    (0, _privateRegistry.default)(this).set('mute', state);
    return this;
  }
  /**
   * Unmute stdout in process.
   *
   * @returns {console.services.Interceptor} The Interceptor service instance.
   */


  unmute() {
    return this.mute(false);
  }
  /**
   * Allow interceptors to edit output content.
   *
   * @param {boolean} [state] - Indicates the editable state.
   * @returns {console.services.Interceptor} The Interceptor service instance.
   */


  editable(state = true) {
    (0, _privateRegistry.default)(this).set('editable', state);
    return this;
  }
  /**
   * Deny interceptors to edit output content.
   *
   * @returns {console.services.Interceptor} The Interceptor service instance.
   */


  uneditable() {
    this.editable(false);
    return this;
  }
  /**
   * Keep styles in content when passing it to interceptors.
   *
   * @param {boolean} [state] - Indicates if the style should be kept.
   * @returns {console.services.Interceptor} The Interceptor service instance.
   */


  keepStyle(state = true) {
    (0, _privateRegistry.default)(this).set('style', state);
    return this;
  }
  /**
   * Remove styles in content when passing it to interceptor.
   *
   * @returns {console.services.Interceptor} The Interceptor service instance.
   */


  removeStyle() {
    this.keepStyle(false);
    return this;
  }
  /**
   * Style cleaner.
   *
   * @see keepStyle
   * @see removeStyle
   * @type {Function}
   */


  get styleCleaner() {
    return content => {
      if ((0, _privateRegistry.default)(this).get('style')) {
        return content;
      }

      return content.replace(this.ansiRegexFactory(), '');
    };
  }
  /**
   * Capture interceptor instance.
   *
   * @type {console.interceptors.CaptureInterceptor}
   */


  get captureInterceptor() {
    return (0, _privateRegistry.default)(this).get('terminal.interceptor.capture');
  }
  /**
   * Captured output.
   *
   * @type {Array<string>}
   */


  get output() {
    return this.captureInterceptor.capture;
  }
  /**
   * The intercept-stdout module.
   *
   * @type {Function}
   */


  get interceptStdout() {
    return require('intercept-stdout'); // eslint-disable-line global-require
  }
  /**
   * The ansi-regex module.
   *
   * @type {Function}
   */


  get ansiRegexFactory() {
    return require('ansi-regex'); // eslint-disable-line global-require
  }

}

var _default = Interceptor;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;