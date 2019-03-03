//--------------------------------------------------------
//-- Node IoC - Container - Container
//--------------------------------------------------------
'use strict';


const fs = require('fs');
const __ = require('@absolunet/private-registry');
const ContainerProxy = require('./Proxy');


class Container {

	/**
	 * Make a new Container instance.
	 *
	 * @returns {Container}
	 */
	static make() {
		const instance = new Proxy(new this(), new ContainerProxy());
		if (!this.instance) {
			this.instance = instance;
		}

		return instance;
	}

	/**
	 * Get the current Container instance or create a new one.
	 *
	 * @returns {Container}
	 */
	static getInstance() {
		return this.instance || this.make();
	}

	/**
	 * Container constructor.
	 */
	constructor() {
		__(this).set('pushInto', (prop, key, value) => {
			const collection = __(this).get(prop);
			if (!collection[key]) {
				collection[key] = [];
			}
			collection[key].push(value);
		});
		this.dependenciesProperty = 'dependencies';
		this.flush();
	}

	/**
	 * Bind abstract to the container.
	 *
	 * @param {string} abstract
	 * @param {Function|*} concrete
	 * @param {boolean} shared
	 * @returns {Container}
	 */
	bind(abstract, concrete, shared = false) {
		__(this).get('bindings')[abstract] = { concrete, shared };

		return this;
	}

	/**
	 * Bind abstract as a singleton to the container.
	 *
	 * @param {string} abstract
	 * @param {Function|*} concrete
	 * @returns {Container}
	 */
	singleton(abstract, concrete) {
		return this.bind(abstract, concrete, true);
	}

	/**
	 * Resolve a given argument with either its singleton,
	 * a new instance based on bindings or a new instance
	 * with resolved dependencies.
	 *
	 * @param {*} abstract
	 * @param {{[string]:*}} args
	 * @returns {*}
	 */
	make(abstract, args = {}) {
		if (this.isSingleton(abstract) && Object.keys(args).length === 0) {
			return this.getSingleton(abstract);
		}

		return this.resolve(abstract, args);
	}

	/**
	 * Resolve a given abstract to build a new instance.
	 *
	 * @param {string} abstract
	 * @param {{[string]:*}} args
	 * @returns {*}
	 */
	resolve(abstract, args = {}) {
		const bindings = __(this).get('bindings');
		const decorators = __(this).get('decorators')[abstract] || [];

		let concrete = abstract;
		let shared = false;

		if (this.isBound(abstract)) {
			({ concrete, shared } = bindings[abstract]);
		} else {
			if (this.isTag(abstract)) {
				return this.getTagged(abstract);
			}

			if (!this.isInstantiable(abstract) && !this.isFunction(abstract) && !this.isObject(abstract)) {
				if (this.isValidJsFile(abstract)) {
					return this.make(require(abstract)); // eslint-disable-line global-require
				}

				return this.bindingNotFound(abstract);
			}
		}

		const build = this.build(concrete, args);
		const object = decorators.reduce((obj, decorator) => {
			return decorator(obj);
		}, build);

		if (shared && Object.keys(args).length === 0) {
			__(this).get('singletons')[abstract] = object;
		}

		return object;
	}

	/**
	 * Check if the given abstract is bound to the container.
	 *
	 * @param {string} abstract
	 * @returns {boolean}
	 */
	isBound(abstract) {
		return Object.keys(__(this).get('bindings')).includes(abstract);
	}

	/**
	 * Get singleton from its abstract.
	 *
	 * @param {string} abstract
	 * @returns {*}
	 */
	getSingleton(abstract) {
		return __(this).get('singletons')[abstract];
	}

	/**
	 * Check if a given abstract has a resolved singleton.
	 *
	 * @param {string} abstract
	 * @returns {boolean}
	 */
	isSingleton(abstract) {
		const singletons = __(this).get('singletons');

		return Boolean(singletons[abstract]);
	}

	/**
	 * Instantiate a given class and resolve its dependencies.
	 *
	 * @param {Function} Concrete
	 * @param {{[string]:*}} args
	 * @returns {*}
	 */
	instantiate(Concrete, args = {}) {
		const dependencies = Concrete[this.dependenciesProperty] || [];
		const resolvedDependencies = [];
		dependencies.forEach((name) => {
			const dependency = args[name] || this.make(name);

			resolvedDependencies.push(dependency);
		});

		return new Concrete(...resolvedDependencies);
	}

	/**
	 * Call a given function with the given arguments.
	 *
	 * @param {Function} factory
	 * @param {{[string]:*}} args
	 * @returns {*}
	 */
	call(factory, args = {}) {
		return factory(this, args);
	}

	/**
	 * Make a mass assignment to a given object.
	 *
	 * @param {*} obj
	 * @param {{[string]:*}} args
	 * @returns {*}
	 */
	assign(obj, args = {}) {
		Object.keys(args).forEach((name) => {
			obj[name] = args[name];
		});

		return obj;
	}

	/**
	 * Build a given concrete, either a factory, a class or an object.
	 *
	 * @param {Function|*} concrete
	 * @param {{[string]:*}} args
	 * @returns {*}
	 */
	build(concrete, args = {}) {
		if (this.isInstantiable(concrete)) {
			return this.instantiate(concrete, args);
		}

		if (this.isFunction(concrete)) {
			return this.call(concrete, args);
		}

		return this.assign(concrete, args);
	}

	/**
	 * Decorate a given abstract with a callback.
	 *
	 * @param {string} abstract
	 * @param {Function} decorator
	 */
	decorate(abstract, decorator) {
		__(this).get('pushInto')('decorators', abstract, decorator);
	}

	/**
	 * Tag a given abstract.
	 *
	 * @param {string} abstract
	 * @param {string} tag
	 */
	tag(abstract, tag) {
		__(this).get('pushInto')('tags', tag, abstract);
	}

	/**
	 * Check if the given string was used as a tag.
	 *
	 * @param {string} tag
	 * @returns {boolean}
	 */
	isTag(tag) {
		return Object.prototype.hasOwnProperty.call(__(this).get('tags'), tag);
	}

	/**
	 * Get tagged dependencies from the tag name.
	 *
	 * @param {string} tag
	 * @returns {{[string]:*}}
	 */
	getTagged(tag) {
		const tagged = __(this).get('tags')[tag] || [];
		const bindings = {};
		tagged.forEach((binding) => {
			bindings[binding] = this.make(binding);
		});

		return bindings;
	}

	/**
	 * Flush container from attached abstracts and concretes.
	 */
	flush() {
		__(this).set('bindings', {});
		__(this).set('singletons', {});
		__(this).set('decorators', {});
		__(this).set('tags', {});
		this.singleton('app', this);
	}

	/**
	 * Throw an error announcing that the given abstract was not found.
	 *
	 * @param {string} abstract
	 * @throws Error
	 */
	bindingNotFound(abstract) {
		throw new Error(`Binding [${abstract}] was not found in the container.`);
	}

	/**
	 * Check if the given object is instantiable.
	 *
	 * @param {Function|*} obj
	 * @returns {boolean}
	 */
	isInstantiable(obj) {
		return Boolean(obj) && Boolean(obj.prototype) && Boolean(obj.prototype.constructor.name);
	}

	/**
	 * Check if the given object is a function.
	 *
	 * @param {Function|*} obj
	 * @returns {boolean}
	 */
	isFunction(obj) {
		return typeof obj === 'function';
	}

	/**
	 * Check if the given object is an object.
	 *
	 * @param obj
	 * @returns {boolean}
	 */
	isObject(obj) {
		return typeof obj === 'object' && obj !== null;
	}

	/**
	 * Check if the given file is a valid and existing JavaScript file with a valid extension.
	 *
	 * @param {string} filePath
	 * @returns {boolean}
	 */
	isValidJsFile(filePath) {
		return (/\.js$/u).test(filePath) && fs.existsSync(filePath);
	}

	/**
	 * Dependencies property accessor.
	 *
	 * @returns {string}
	 */
	get dependenciesProperty() {
		return __(this).get('property');
	}

	/**
	 * Dependencies property mutator.
	 *
	 * @param {string} name
	 */
	set dependenciesProperty(name) {
		__(this).set('property', name);
	}

}

module.exports = Container;
