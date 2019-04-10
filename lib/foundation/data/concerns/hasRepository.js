//--------------------------------------------------------
//-- Node IoC - Foundation - Data - Concerns - Has Repository
//--------------------------------------------------------
'use strict';


const { factory } = require('./../../../support/mixins');


module.exports = factory((SuperClass) => {

	return class HasRepository extends SuperClass {

		static get dependencies() {
			return (super.dependencies || []).concat(['app']);
		}

		get repository() {
			throw new TypeError('Accessor [repository] must be implemented. It should return a Repository resolvable instance.');
		}

		static all() {
			return (new this()).getRepository().all();
		}

		static find(...args) {
			return (new this()).getRepository().find(...args);
		}

		static findOrFail(...args) {
			return (new this()).getRepository().findOrFail(...args);
		}

		create(data = {}) {
			this.fill(data);

			return this.getRepository().create(this);
		}

		save() {
			return this.getRepository().save(this);
		}

		delete() {
			return this.getRepository().delete(this);
		}

		getRepository() {
			return this.app.make(this.repository);
		}

	};

});
