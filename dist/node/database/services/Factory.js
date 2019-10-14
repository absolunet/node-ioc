//--------------------------------------------------------
//-- Node IoC - Database - Services - Factory
//--------------------------------------------------------
'use strict';

const __ = require('@absolunet/private-registry');
/**
 * Factory service that helps build factoried model instances through defined model factories.
 *
 * @memberof database.services
 * @hideconstructor
 */


class Factory {
  /**
   * Class dependencies.
   *
   * @type {Array<string>}
   */
  static get dependencies() {
    return ['app', 'db.model', 'faker'];
  }
  /**
   * @inheritdoc
   * @private
   */


  init() {
    __(this).set('factories', {});
  }
  /**
   * Get model factory instance by name.
   *
   * @param {string} name - The model factory name.
   * @returns {Factory} - The model factory instance.
   */


  get(name) {
    const factory = __(this).get('factories')[name];

    if (!factory) {
      throw new TypeError(`Cannot find factory for model [${name}].`);
    }

    return factory;
  }
  /**
   * Make a model with attributes from its associated factory.
   *
   * @example
   * factory.make('user'); // User { name: "John Smith", email: "john.smith@example.com" }
   * factory.make('user', { name: 'John Doe' }); // User { name: "John Doe", email: "john.smith@example.com" }
   * factory.make('user', 3); // Collection { [User { name: 'John Smith', email: 'john.smith@example.com }, User { ... }, User { ... }] }
   * factory.make('user, { name: 'John Doe' }, 2); // Collection { []User { name: 'John Doe', email: 'johm.smith@example.com' }, User { ... }] }
   *
   * @param {string} model - The model name.
   * @param {object<string, *>|number} [parameters={}] - The parameters to put into the model manually, overwriting matching factoried values. Can also be the times if no parameter are given.
   * @param {number} [times=1] - The quantity of models that needed to be factoried. Minimum 1 model is required.
   * @returns {Model|Collection} - Either a single Model instance or a Model Collection instance, containing N times the requested model.
   */


  make(model, parameters = {}, times = 1) {
    const ModelInstance = __(this).get('db.model').get(model);

    const factory = this.get(model);
    const count = typeof parameters === 'number' ? parameters : times;
    const properties = typeof parameters === 'number' ? {} : parameters;

    if (count <= 0) {
      throw new TypeError('Cannot make less than one model.');
    }

    const models = [...new Array(count).keys()].map(() => {
      return new ModelInstance({ ...factory.make(this.faker),
        ...properties
      });
    });
    return count === 1 ? models[0] : ModelInstance.collection(models);
  }
  /**
   * Register factory for a given model.
   * If the model name is not provided, it will be taken from the factory instance.
   *
   * @param {Factory} factory - The factory class.
   * @param {string|null} [model] - The model name. If no value is provided, the factory model will be taken.
   * @returns {Factory} - The factory service instance.
   */


  register(factory, model = null) {
    const instance = this.app.make(factory);
    __(this).get('factories')[model || instance.model] = instance;
    return this;
  }

}

module.exports = Factory;