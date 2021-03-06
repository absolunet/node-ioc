//--------------------------------------------------------
//-- Node IoC - Database - Repositories - Model Repository
//--------------------------------------------------------


/**
 * Model repository that bridges the application models with the ORM engine.
 *
 * @memberof database.repositories
 * @hideconstructor
 */
class ModelRepository {

	/**
	 * Class dependencies: <code>['db.orm']</code>.
	 *
	 * @type {Array<string>}
	 */
	static get dependencies() {
		return ['db.orm'];
	}

	/**
	 * Register a model.
	 *
	 * @param {string} name - The model name.
	 * @param {database.Model} Model - The model instance.
	 * @returns {database.repositories.ModelRepository} The current ModelRepository instance.
	 */
	set(name, Model) {
		this.dbOrm.registerModel(name, Model);

		return this;
	}

	/**
	 * Get a model by name.
	 *
	 * @param {string} name - The model name.
	 * @returns {database.Model} The model instance.
	 * @throws {TypeError} Indicates that the model was not found.
	 */
	get(name) {
		const model = this.dbOrm.getModel(name);

		if (!model) {
			throw new TypeError(`Model [${name}] not found.`);
		}

		return model;
	}

	/**
	 * Check if a model exists.
	 *
	 * @param {string} name - The model name.
	 * @returns {boolean} Indicates that the model exists.
	 */
	has(name) {
		try {
			return Boolean(this.get(name));
		} catch (error) {
			return false;
		}
	}

}


export default ModelRepository;
