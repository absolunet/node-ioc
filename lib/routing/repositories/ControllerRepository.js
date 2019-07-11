//--------------------------------------------------------
//-- Node IoC - Routing - Repositories - Controller Repository
//--------------------------------------------------------
'use strict';

const __ = require('@absolunet/private-registry');


class ControllerRepository {

	/**
	 * {@inheritdoc}
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
	 * @param {string} name
	 * @param {Controller} controller
	 * @returns {ControllerRepository}
	 */
	add(name, controller) {
		this.app.bind(this.resolveName(name), controller);

		return this;
	}

	/**
	 * Get the controller instance by name.
	 *
	 * @param {string} name
	 * @returns {Controller}
	 */
	get(name) {
		return this.app.make(this.getName(name));
	}

	/**
	 * Check if the given controller was registered.
	 *
	 * @param {string} name
	 * @returns {boolean}
	 */
	has(name) {
		return this.app.isBound(this.getName(name));
	}

	/**
	 * Group controllers inside a given namespace.
	 *
	 * @param {string} name
	 * @param {Function} closure
	 * @returns {ControllerRepository}
	 */
	group(name, closure) {
		const groups = __(this).get('groups');
		const index = groups.push({ name }) - 1;
		closure();
		groups.splice(index, 1);

		return this;
	}

	/**
	 * Resolve the name based on current groups and given name.
	 *
	 * @param {string} name
	 * @returns {string}
	 */
	resolveName(name) {
		return this.getName([...__(this).get('groups'), { name }]
			.map(({ name: part }) => {
				return part;
			})
			.join(this.namespaceSeparator));
	}

	/**
	 * Get the name that is used for container binding.
	 *
	 * @param {string} name
	 * @param {boolean} [withAction]
	 * @returns {string}
	 */
	getName(name, withAction = false) {
		const fullName = `controller.${name}`;

		return withAction ? fullName : fullName.replace(this.actionPattern, '');
	}

	/**
	 * Get the action from the given qualified controller name.
	 * @example
	 * 	this.resolveAction('PostController@show'); // 'show'
	 *
	 * @param {string} name
	 * @returns {string}
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
	 * @type {string}
	 */
	get coreNamespace() {
		return 'core';
	}

}

module.exports = ControllerRepository;
