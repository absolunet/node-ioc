"use strict";

exports.default = void 0;

var _Driver = _interopRequireDefault(require("./Driver"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Node IoC - Database - Services - ORM - Drivers - Bookshelf driver
//--------------------------------------------------------

/**
 * ORM Driver for Bookshelf ORM for Knex.
 *
 * @memberof database.services.ORM.drivers
 * @augments database.services.ORM.drivers.Driver
 * @hideconstructor
 */
class BookshelfDriver extends _Driver.default {
  /**
   * @inheritdoc
   */
  buildEngine(connection) {
    return require('bookshelf')(connection); // eslint-disable-line global-require
  }
  /**
   * @inheritdoc
   */


  buildModel(model) {
    const {
      app,
      engine
    } = this;
    return this.app.make(model, {
      app,
      engine
    });
  }
  /**
   * Set Bookshelf engine.
   * Bind defined plugins into the engine instance.
   *
   * @param {bookshelf} engine - The Bookshelf instance.
   */


  setEngine(engine) {
    super.setEngine(engine);
    this.plugins.forEach(({
      plugin,
      options = {}
    }) => {
      engine.plugin(plugin, options);
    });
    engine.resolve = this.resolveModel.bind(this);
  }
  /**
   * Extend Bookshelf collection instance.
   *
   * @param {bookshelf} [engine] - The Bookshelf instance.
   */


  extendCollection(engine = this.engine) {
    engine.Collection = engine.Collection.extend({
      save(...parameters) {
        return this.invokeThen('save', parameters);
      },

      update(...parameters) {
        return this.invokeThen('update', parameters);
      },

      delete(...parameters) {
        return this.invokeThen('delete', parameters);
      }

    });
  }
  /**
   * Plugins to be bind into a Bookshelf instance.
   *
   * @type {Array<string|Function>}
   */


  get plugins() {
    return [{
      plugin: require('bookshelf-uuid')
    }, // eslint-disable-line global-require
    {
      plugin: this.extendCollection.bind(this)
    }];
  }

}

var _default = BookshelfDriver;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;