//--------------------------------------------------------
//-- Node IoC - Routing - Repositories - Controller Repository
//--------------------------------------------------------
'use strict';

const path = require('path');
const __   = require('@absolunet/private-registry');


class ControllerRepository {

	/**
	 * {@inheritdoc}
	 */
	static get dependencies() {
		return ['app', 'file'];
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
		const fullName = this.getName(name);
		if (this.app.isBound(fullName)) {
			return this.app.make(this.getName(name));
		}

		return this.getFromPath(this.app.make('path.controller'), name);
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
	 * @param {Function} group
	 * @returns {ControllerRepository}
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
	 * @param {string} controllerPath
	 * @param {string} name
	 * @returns {Controller}
	 */
	getFromPath(controllerPath, name) {
		const escape = '\\';
		const regex = new RegExp(`${escape}${this.namespaceSeparator}`, 'gu');
		const fileName = this.getControllerName(name).replace(regex, path.sep);
		const filePath = path.join(controllerPath, fileName);

		return this.app.make(filePath);
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

		return withAction ? fullName : this.getControllerName(fullName);
	}

	/**
	 * Get controller name without container prefix or action.
	 *
	 * @param {string} name
	 * @returns {string}
	 */
	getControllerName(name) {
		return name.replace(this.actionPattern, '');
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

	/**
	 * @type {Container}
	 */
	get app() {
		return __(this).get('app');
	}

}

module.exports = ControllerRepository;
