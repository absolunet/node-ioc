//--------------------------------------------------------
//-- Node IoC - HTTP - Repositories - Controller Repository
//--------------------------------------------------------

import __ from '@absolunet/private-registry';


/**
 * Controller repository where controller registration and instantiation are done.
 *
 * @memberof http.repositories
 * @hideconstructor
 */
class ControllerRepository {

	/**
	 * Class dependencies: <code>['app']</code>.
	 *
	 * @type {Array<string>}
	 */
	static get dependencies() {
		return ['app'];
	}

	/**
	 * ControllerRepository constructor.
	 */
	constructor() {
		__(this).set('groups', []);
	}

	/**
	 * Add a controller binding.
	 *
	 * @param {string} name - The controller name.
	 * @param {Controller} controller - The controller class.
	 * @returns {ControllerRepository} - The current controller repository instance.
	 */
	add(name, controller) {
		this.app.bind(this.buildName(name), controller);

		return this;
	}

	/**
	 * Get the controller instance by name.
	 * If it was not registered into the repository, it will attempt to find it in the application folder.
	 *
	 * @param {string} name - The controller name.
	 * @returns {Controller} - The controller instance.
	 */
	get(name) {
		const fullName = this.getName(name);

		if (this.app.isBound(fullName)) {
			return this.app.make(this.getName(name));
		}

		return this.getFromPath(this.app.controllerPath(), name);
	}

	/**
	 * Check if the given controller was registered.
	 *
	 * @param {string} name - The controller name.
	 * @returns {boolean} - Indicates that the controller name was already registered into the repository.
	 */
	has(name) {
		return this.app.isBound(this.getName(name));
	}

	/**
	 * Group controllers inside a given namespace.
	 *
	 * @param {string} name - The group namespace.
	 * @param {Function} group - The controller group closure.
	 * @returns {ControllerRepository} - The current controller repository instance.
	 */
	group(name, group) {
		const groups = __(this).get('groups');
		const index = groups.push({ name }) - 1;
		group(this, this.app);
		groups.splice(index, 1);

		return this;
	}

	/**
	 * Make controller instance from base path and controller name.
	 * Mainly relies on path structure and file name.
	 *
	 * @param {string} controllerPath - The controller file path.
	 * @param {string} name - The controller name.
	 * @returns {Controller} - The resolved controller instance.
	 */
	getFromPath(controllerPath, name) {
		const escape = '\\';
		const regex = new RegExp(`${escape}${this.namespaceSeparator}`, 'gu');
		const fileName = this.resolveName(name).replace(regex, '/');
		const filePath = this.app.formatPath(controllerPath, fileName);

		return this.app.make(filePath);
	}

	/**
	 * Resolve the name based on current groups and given name.
	 *
	 * @param {string} name - The base name.
	 * @returns {string} - The resolved, fully qualified, name.
	 */
	buildName(name) {
		return this.getName([...__(this).get('groups'), { name }]
			.map(({ name: part }) => {
				return part;
			})
			.join(this.namespaceSeparator));
	}

	/**
	 * Get the name that is used for container binding.
	 *
	 * @param {string} name - The controller name.
	 * @param {boolean} [withAction=false] - Indicates that the returned value should contain the action.
	 * @returns {string} - The controller name into toe container.
	 */
	getName(name, withAction = false) {
		const fullName = `controller.${name}`;

		return withAction ? fullName : this.resolveName(fullName);
	}

	/**
	 * Get controller name without container prefix or action.
	 *
	 * @param {string} name - The controller action.
	 * @returns {string} - The controller name without the action method.
	 */
	resolveName(name) {
		return name.replace(this.actionPattern, '');
	}

	/**
	 * Get the action from the given qualified controller name.
	 *
	 * @example
	 * this.resolveAction('PostController@show'); // 'show'
	 *
	 * @param {string} name - The controller action.
	 * @returns {string} - The controller method name, without the controller name.
	 */
	resolveAction(name) {
		return name.match(this.actionPattern).groups.action;
	}

	/**
	 * Action pattern for qualified action.
	 *
	 * @type {RegExp}
	 */
	get actionPattern() {
		return /@(?<action>.*)$/u;
	}

	/**
	 * Controller namespace separator.
	 *
	 * @type {string}
	 */
	get namespaceSeparator() {
		return '.';
	}

	/**
	 * The namespace for core controllers.
	 *
	 * @type {string}
	 */
	get coreNamespace() {
		return 'core';
	}

}


export default ControllerRepository;
