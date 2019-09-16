//--------------------------------------------------------
//-- Node IoC - Database - Services - ORM - Drivers - Bookshelf driver
//--------------------------------------------------------
'use strict';

const bookshelf   = require('bookshelf');
const uuidPlugin  = require('bookshelf-uuid');
const Driver      = require('./Driver');


class BookshelfDriver extends Driver {

	/**
	 * {@inheritdoc}
	 */
	buildEngine(connection) {
		return bookshelf(connection);
	}

	/**
	 * {@inheritdoc}
	 */
	buildModel(model) {
		const { app, engine } = this;

		return this.app.make(model, { app, engine });
	}

	/**
	 * Set Bookshelf engine.
	 * Bind defined plugins into the engine instance.
	 *
	 * @param {bookshelf} engine
	 */
	setEngine(engine) {
		super.setEngine(engine);
		this.plugins.forEach(({ plugin, options = {} }) => {
			engine.plugin(plugin, options);
		});
		engine.resolve = this.resolveModel.bind(this);
	}

	/**
	 * Extend Bookshelf collection instance.
	 *
	 * @param {bookshelf} [engine]
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
	 * @type {string[]|Function[]}
	 */
	get plugins() {
		return [
			{ plugin: uuidPlugin },
			{ plugin: this.extendCollection.bind(this) }
		];
	}

}


module.exports = BookshelfDriver;
