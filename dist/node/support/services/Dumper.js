"use strict";

exports.default = void 0;

var _privateRegistry = _interopRequireDefault(require("@absolunet/private-registry"));

var _checksTypes = _interopRequireDefault(require("../../support/mixins/checksTypes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Support - Services - Dumper
//--------------------------------------------------------

/**
 * @private
 * @typedef {object<string, string|number>} DumperThemeFont
 * @property {string} name - The font family name.
 * @property {number} weight - The font weight.
 * @property {string} size - The font size, with the unit of measure.
 * @property {string} link - The URL to load the font from.
 * @memberof support.services.Dumper
 */

/**
 * @private
 * @typedef {object<string, string>} DumperThemeColors
 * @property {string} background - The background color.
 * @property {string} text - The default text color.
 * @property {string} key - The object and array keys color.
 * @property {string} type - The value type names color.
 * @property {string} boolean - The boolean values color.
 * @property {string} function - The function values color.
 * @property {string} number - The numeric value color.
 * @property {string} string - The string values color.
 * @property {string} symbol - The Symbol values color.
 * @memberof support.services.Dumper
 */

/**
 * @private
 * @typedef {object} DumperTheme
 * @property {number} indent - The indentation size.
 * @property {boolean} open - Indicates that the dumper should expand all objects and arrays on render.
 * @property {support.services.Dumper.DumperThemeFont} font - The font configuration.
 * @property {support.services.Dumper.DumperThemeColors} colors - The colors.
 * @memberof support.services.Dumper
 */

/**
 * @private
 * @typedef {object} DumperData
 * @property {Array<string>} dumps - The rendered dumps.
 * @property {Array<*>} values - The dumped raw values.
 * @property {support.services.Dumper.DumperTheme} theme - The current theme configuration.
 * @property {string} [location] - The dump file location.
 * @property {string} [locationLink] - The dump file location link formatted for current IDE.
 * @memberof support.services.Dumper
 */

/**
 * HTTP variable dumper.
 *
 * @memberof support.services
 * @hideconstructor
 */
class Dumper extends (0, _checksTypes.default)() {
  /**
   * Class dependencies: <code>['app', 'config', 'ide.link']</code>.
   *
   * @type {Array<string>}
   */
  static get dependencies() {
    return (super.dependencies || []).concat(['app', 'config', 'ide.link']);
  }
  /**
   * @inheritdoc
   * @private
   */


  init() {
    (0, _privateRegistry.default)(this).set('instances', new Map());
    (0, _privateRegistry.default)(this).set('currentInstances', []);
    this.resetDelta();
    this.useTheme(this.config.get('dev.dumper.default', 'absolunet'));
  }
  /**
   * Dump variables as an HTTP response, or in the console if response is not available.
   *
   * @param {...*} parameters - The dumped parameters.
   */


  dump(...parameters) {
    if (this.shouldDump()) {
      this.respondWithDump(this.getDumpData(...parameters));
    }
  }
  /**
   * Dump variable from the explicitly given file.
   *
   * @param {string} file - The file the dump was originally called.
   * @param {...*} parameters - The dumped parameters.
   */


  dumpForFile(file, ...parameters) {
    if (this.shouldDump()) {
      this.respondWithDump(this.getDumpDataForFile(file, ...parameters));
    }
  }
  /**
   * Send the proper response with the dumped data.
   *
   * @param {support.services.Dumper.DumperData} data - The processed dump data model.
   */


  respondWithDump(data) {
    const {
      response,
      terminal
    } = this;

    if (this.shouldDump()) {
      if (response) {
        response.status(500).end(this.makeView('index', data));
        this.setResponse(undefined);
      } else {
        data.values.forEach(value => {
          terminal.echo(value);
        });
      }
    }
  }
  /**
   * Get dump without the whole HTML page around it.
   *
   * @param {...*} parameters - The dumped parameters.
   * @returns {string} The rendered dump.
   */


  getDump(...parameters) {
    return this.makeDump(this.getDumpData(...parameters));
  }
  /**
   * Get dump without the whole HTML page around it from the explicitly given file.
   *
   * @param {string} file - The file the dump was originally called.
   * @param {...*} parameters - The dumped parameters.
   * @returns {string} The rendered dump.
   */


  getDumpForFile(file, ...parameters) {
    return this.makeDump(this.getDumpDataForFile(file, ...parameters));
  }
  /**
   * Make dump view with the dump formatted data.
   *
   * @param {support.services.Dumper.DumperData} data - The processed dump data model.
   * @returns {string} The rendered dump.
   */


  makeDump(data) {
    return this.makeView('dump', data);
  }
  /**
   * Get dump data without the main rendered view.
   *
   * @param {...*} parameters - The dumped parameters.
   * @returns {support.services.Dumper.DumperData} The processed dump data model.
   */


  getDumpData(...parameters) {
    const {
      theme
    } = this;
    const location = this.getLocation();
    const locationLink = this.getLocationLink();
    const dumps = parameters.map(parameter => {
      return this.stringify(parameter);
    });
    this.resetDelta();
    return {
      dumps,
      location,
      locationLink,
      theme,
      values: parameters
    };
  }
  /**
   * Get dump data withou the main rendered view for the explicitly given file.
   *
   * @param {string} file - The file the dump was originally called.
   * @param {...*} parameters - The dumped parameters.
   * @returns {support.services.Dumper.DumperData} The processed dump data model.
   */


  getDumpDataForFile(file, ...parameters) {
    const data = this.getDumpData(...parameters);
    data.location = file;
    data.locationLink = this.getLocationLink(file);
    return data;
  }
  /**
   * Stringify a value by using the dedicated views for the current view engine.
   *
   * @param {*} data - The data to stringify.
   * @param {number} [level=0] - The depth level.
   * @returns {string} The stringified value.
   */


  stringify(data, level = 0) {
    const delta = this.getDelta(data);
    const isObject = this.isObject(data);
    let type;
    let value;

    if (isObject) {
      ({
        type,
        value
      } = this.getStringifiedObjectModel(data, level));
    } else {
      ({
        type,
        value
      } = this.getStringifiedPrimitiveModel(data));
    }

    return this.makeView('item', {
      delta,
      isObject,
      type,
      value
    });
  }
  /**
   * Stringify a plain object, an instance or an array and return a model containing rendering information.
   *
   * @param {object|Array<*>} data - The data to stringify.
   * @param {number} [level=0] - The depth level.
   * @returns {{type: string, value: string, empty: boolean}} The rendering information with the stringified value.
   */


  getStringifiedObjectModel(data, level = 0) {
    const keys = Object.keys(data).sort();
    const symbols = Array.isArray(data) ? {
      open: '[',
      close: ']'
    } : {
      open: '{',
      close: '}'
    };
    const depth = [...new Array(level).keys()];
    const type = this.getObjectTypeName(data);
    const currentInstances = (0, _privateRegistry.default)(this).get('currentInstances');
    currentInstances.push(data);
    const items = keys.map(key => {
      return this.getStringifiedObjectItemModel(key, data[key], level + 1);
    });
    currentInstances.splice(currentInstances.indexOf(data), 1);
    return {
      empty: keys.length === 0,
      type,
      value: this.makeView('object', {
        depth,
        items,
        symbols
      })
    };
  }
  /**
   * Stringify object item and return a model containing rendering information.
   *
   * @param {string|number} key - The object item key.
   * @param {*} data - The object item.
   * @param {number} [level=1] - The depth level.
   * @returns {{depth: *, value: *, key: *}} The rendering information with the stringified value.
   */


  getStringifiedObjectItemModel(key, data, level = 1) {
    const itemDepth = [...new Array(level).keys()];
    const isCircular = typeof data === 'object' && (0, _privateRegistry.default)(this).get('currentInstances').includes(data);
    return {
      depth: itemDepth,
      key,
      value: this[`stringify${isCircular ? 'Circular' : ''}`](data, level)
    };
  }
  /**
   * Stringify ciurcular reference.
   *
   * @param {object|Array<*>} data - The circular instance.
   * @returns {string} The stringified circular reference.
   */


  stringifyCircular(data) {
    return this.makeView('item', {
      delta: this.getDelta(data),
      isObject: true,
      type: this.getObjectTypeName(data),
      value: `[circular]`
    });
  }
  /**
   * Stringify a non-object primitive and return a model containing rendering information.
   *
   * @param {*} data - The data to stringify.
   * @returns {{type: string, value: string}} The rendering information with the stringified value.
   */


  getStringifiedPrimitiveModel(data) {
    const type = data === null ? 'null' : typeof data;
    let value;

    if (['boolean', 'number', 'string', 'undefined'].includes(typeof data) || !data) {
      value = JSON.stringify(data);
    } else {
      value = data.toString();

      if (type === 'function') {
        value = value.replace(/^(?<start>.*)\{.*/su, '$<start>{}');
      }
    }

    return {
      type,
      value: this.makeView('primitive', {
        type,
        value
      })
    };
  }
  /**
   * Get object type formatted name.
   *
   * @param {object|Array<*>} data - The object to get name from.
   * @returns {string} The object name.
   */


  getObjectTypeName(data) {
    const type = (data.constructor || Object).name;
    return [Object.name, Array.name].includes(type) ? type.toLowerCase() : type;
  }
  /**
   * Reset the instance delta.
   */


  resetDelta() {
    (0, _privateRegistry.default)(this).set('delta', 0);
  }
  /**
   * Get delta for specific instance.
   * If not an object or an array, null is returned.
   *
   * @param {*} instance - The instance to get delta from.
   * @returns {null|number} The delta, or null if not applicable.
   */


  getDelta(instance) {
    if (!this.isObject(instance)) {
      return null;
    }

    const instances = (0, _privateRegistry.default)(this).get('instances');
    const existingDelta = instances.get(instance);

    if (existingDelta) {
      return existingDelta;
    }

    const delta = (0, _privateRegistry.default)(this).get('delta') + 1;
    instances.set(instance, delta);
    (0, _privateRegistry.default)(this).set('delta', delta);
    return delta;
  }
  /**
   * Use theme by name.
   * The theme data will be fetched from the `http.dumper.themes` configuration.
   *
   * @param {string} theme - The theme name.
   * @returns {http.services.Dumper} The current dumper instance.
   */


  useTheme(theme) {
    (0, _privateRegistry.default)(this).set('theme', theme);
    return this;
  }
  /**
   * Set the current response instance.
   *
   * @param {response} response - The current response instance.
   * @returns {http.services.Dumper} The current dumper instance.
   */


  setResponse(response) {
    (0, _privateRegistry.default)(this).set('response', response);
    return this;
  }
  /**
   * Render a view by name with the appropriate namespace for the current engine.
   *
   * @param {string} viewName - The view name, without namespace or engine prefix.
   * @param {*} data - The view-model data.
   * @returns {string} The rendered view.
   */


  makeView(viewName, data) {
    if (this.shouldDump()) {
      return this.view.make(`dumper::${this.config.get('view.engine', 'jsrender')}.${viewName}`, data);
    }

    return '';
  }
  /**
   * Get the dump file and line location.
   *
   * @returns {string} The dump call location.
   */


  getLocation() {
    return new Error().stack.split('\n').slice(1).filter(line => {
      return !line.includes(this.app.formatPath(__filename, '..', '..'));
    }).shift().replace(/.*\((?<location>.*:\w+:\w+)\)/u, '$<location>');
  }
  /**
   * Get the dump location IDE link.
   *
   * @param {string} [location=this.getLocation()] - The location to get link from.
   * @returns {string} The IDE link to the dump call.
   */


  getLocationLink(location = this.getLocation()) {
    const [file, line] = location.split(':');
    return (this.ideLink.get(this.config.get('dev.ide')) || '').replace('%line', encodeURIComponent(line)).replace('%file', encodeURIComponent(file));
  }
  /**
   * Check if the dumper should dump or return dumped content based on the current environment and configuration.
   *
   * @returns {boolean} Indicates that the dumper should dump.
   */


  shouldDump() {
    return this.config.get('dev.dumper.enabled', false);
  }
  /**
   * The theme configuration.
   *
   * @type {object<string, *>}
   */


  get theme() {
    return this.config.get(`dev.dumper.themes.${(0, _privateRegistry.default)(this).get('theme')}`, {
      indent: 4,
      open: false,
      font: {
        name: 'Fira mono',
        weight: 400,
        size: '1em',
        link: 'https://fonts.googleapis.com/css?family=Fira+Mono:400',
        colors: {
          'background': '#2b2d3c',
          'text': '#4ea4e7',
          'key': '#f2f2f2',
          'type': '#1aabb6',
          'boolean': '#ff5252',
          'function': '#ff5252',
          'number': '#ff5252',
          'string': '#b6d8ee',
          'symbol': '#b6d8ee'
        }
      }
    });
  }
  /**
   * The current response instance.
   *
   * @type {response|null}
   */


  get response() {
    return (0, _privateRegistry.default)(this).get('response') || null;
  }
  /**
   * Terminal service.
   *
   * @type {console.services.Terminal}
   */


  get terminal() {
    return this.app.make('terminal');
  }
  /**
   * View factory.
   *
   * @type {view.services.Factory}
   */


  get view() {
    return this.app.make('view');
  }

}

var _default = Dumper;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;