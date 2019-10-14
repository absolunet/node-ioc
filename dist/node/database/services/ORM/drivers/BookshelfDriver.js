//--------------------------------------------------------
//-- Node IoC - Database - Services - ORM - Drivers - Bookshelf driver
//--------------------------------------------------------
'use strict';

const Driver = require('./Driver');
/**
 * ORM Driver for Bookshelf ORM for Knex.
 *
 * @memberof database.services.ORM.drivers
 * @augments database.services.ORM.drivers.Driver
 * @hideconstructor
 */


class BookshelfDriver extends Driver {
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

module.exports = BookshelfDriver;