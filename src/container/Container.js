//--------------------------------------------------------
//-- Node IoC - Container - Container
//--------------------------------------------------------

import to             from 'to-case';
import __             from '@absolunet/private-registry';
import checksTypes    from '../support/mixins/checksTypes';
import ContainerProxy from './Proxy';


/**
 * Inversion of Control container that allows bindings and factory with dependency injection, exposes tags, aliases and other IoC features.
 *
 * @memberof container
 * @augments support.mixins.CheckTypes
 * @hideconstructor
 */
class Container extends checksTypes() {

	/**
	 * Make a new Container instance.
	 *
	 * @returns {container.Container} A container instance.
	 */
	static make() {
		const instance = new this();
		if (!this.instance) {
			this.setDefaultInstance(instance);
		}

		return instance;
	}

	/**
	 * Get the current Container instance or create a new one.
	 *
	 * @returns {container.Container} The current instance or a newly created instance if no instance exists.
	 */
	static getInstance() {
		return this.instance || this.make();
	}

	/**
	 * Set the current Container instance.
	 *
	 * @param {container.Container} instance - A Container instance.
	 * @throws {TypeError} Indicates that the default instance was not a container instance.
	 */
	static setDefaultInstance(instance) {
		if (!(instance instanceof this)) {
			throw new TypeError('Default container instance must be instance of Container or subclass.');
		}

		this.instance = instance;
	}

	/**
	 * Container constructor.
	 */
	constructor() {
		super();
		this.setContext(module);
		__(this).set('pushInto', (property, key, value) => {
			const collection = __(this).get(property);
			if (!collection[key]) {
				collection[key] = [];
			}
			collection[key].push(value);
		});
		this.flush();

		const proxy = new Proxy(this, new ContainerProxy());
		__(this).set('proxy', proxy);

		return proxy;
	}

	/**
	 * Set JavaScript module context.
	 *
	 * @param {module} context - The Node.js module that represents the current context.
	 * @returns {container.Container} The current container instance.
	 */
	setContext(context) {
		if (!this.isFunction(context.require)) {
			throw new TypeError('The given context is not a valid module.');
		}

		__(this).set('context', context);

		return __(this).get('proxy');
	}

	/**
	 * Get current JavaScript module context.
	 *
	 * @returns {module} The Node.js module that represents the current context.
	 */
	getContext() {
		return __(this).get('context');
	}

	/**
	 * Bind abstract to the container.
	 *
	 * @param {string} abstract - Abstract representation of a concrete. Should be treated as an interface.
	 * @param {Function|*} concrete - Concrete reflecting the abstract. Can be either a class, a factory closure, an instance or even a primitive value, such as a string or a boolean.
	 * @param {boolean} shared - Indicates that the concrete should be treated as a singleton and be shared through all the other instances when requested.
	 * @returns {container.Container} The current container instance.
	 */
	bind(abstract, concrete, shared = false) {
		__(this).get('bindings')[abstract] = { concrete, shared };
		delete __(this).get('singletons')[abstract];

		return __(this).get('proxy');
	}

	/**
	 * Bind abstract as a singleton to the container.
	 *
	 * @param {string} abstract - Abstract representation of a concrete. Should be treated as an interface.
	 * @param {Function|*} concrete - Concrete reflecting the abstract. Can be either a class, a factory closure, an instance or even a primitive value, such as a string or a boolean.
	 * @returns {container.Container} The current container instance.
	 */
	singleton(abstract, concrete) {
		return this.bind(abstract, concrete, true);
	}

	/**
	 * Resolve a given argument with either its singleton,
	 * a new instance based on bindings or a new instance
	 * with resolved dependencies.
	 *
	 * @param {*} abstract - An abstract that was bound to the container, or a class, closure or instance that can be built by the container.
	 * @param {object<string, *>} [parameters={}] - Additional arguments to inject into the concrete when instantiating.
	 * @returns {*} The instantiated or the singleton concrete.
	 */
	make(abstract, parameters = {}) {
		if (this.isSingleton(abstract) && Object.keys(parameters).length === 0) {
			return this.getSingleton(abstract);
		}

		return this.resolve(abstract, parameters);
	}

	/**
	 * Resolve a given abstract to build a new instance.
	 *
	 * @param {*} abstract - An abstract that was bound to the container, or a class, closure or instance that can be built by the container.
	 * @param {object<string, *>} [parameters={}] - Additional arguments to inject into the concrete when instantiating.
	 * @returns {*} The instantiated concrete.
	 */
	resolve(abstract, parameters = {}) {
		const bindings   = __(this).get('bindings');
		const decorators = __(this).get('decorators')[abstract] || [];

		let concrete = abstract;
		let shared   = false;

		if (this.isBound(abstract)) {
			({ concrete, shared } = bindings[abstract]);
		} else {
			if (this.isTag(abstract)) {
				return this.getTagged(abstract, parameters);
			}

			if (!this.isInstantiable(abstract) && !this.isFunction(abstract) && !this.isObject(abstract)) {
				const module = this.getModule(abstract);

				if (typeof module === 'undefined') {
					return this.bindingNotFound(abstract);
				}

				return this.make(module, parameters);
			}
		}

		const build = decorators.reduce((current, decorator) => {
			return decorator(current);
		}, this.build(concrete, parameters));

		if (shared && Object.keys(parameters).length === 0 && !__(this).get('singletons')[abstract]) {
			__(this).get('singletons')[abstract] = build;
		}

		return build;
	}

	/**
	 * Check if the given abstract is bound to the container.
	 *
	 * @param {string} abstract - The abstract to check.
	 * @returns {boolean} Indicates if the abstract is bound in the container.
	 */
	isBound(abstract) {
		return this.getBounds().includes(abstract);
	}

	/**
	 * Get all bindings.
	 *
	 * @returns {Array<string>} List of abstracts bound into the container.
	 */
	getBounds() {
		return Object.keys(__(this).get('bindings') || {});
	}

	/**
	 * Get singleton from its abstract.
	 *
	 * @param {string} abstract - The abstract name that reflects a singleton already instantiated.
	 * @returns {*} The singleton instance.
	 */
	getSingleton(abstract) {
		return __(this).get('singletons')[abstract];
	}

	/**
	 * Check if a given abstract has a resolved singleton.
	 *
	 * @param {string} abstract - The abstract name that may reflect an instantiated singleton.
	 * @returns {boolean} Indicates that the singleton exists and was already instantiated.
	 */
	isSingleton(abstract) {
		return Object.prototype.hasOwnProperty.call(__(this).get('singletons'), abstract);
	}

	/**
	 * Instantiate a given class and resolve its dependencies.
	 *
	 * @param {Function} Concrete - A class that can be instantiated.
	 * @param {object<string, *>} [parameters={}] - Additional arguments to inject into the class instance when instantiating.
	 * @returns {*} The newly created instance.
	 */
	instantiate(Concrete, parameters = {}) {
		const dependencies = [
			...new Set([
				...Concrete.dependencies || [],
				...Object.keys(parameters)
			])
		];
		const resolvedDependencies = [];
		dependencies.forEach((name) => {
			const dependency = parameters[name] || this.make(name);

			resolvedDependencies.push(dependency);
		});

		const instance = new Concrete(...resolvedDependencies);
		const realInstance = instance.__instance || instance;
		dependencies.forEach((dependency, index) => {
			__(realInstance).set(dependency, resolvedDependencies[index]);
			const formattedName = to.camel(dependency);
			if (!Object.prototype.hasOwnProperty.call(realInstance, formattedName)) {
				Object.defineProperty(realInstance, formattedName, {
					value:    resolvedDependencies[index],
					writable: false
				});
			}
		});

		if (this.isFunction(instance.init)) {
			instance.init();
		}

		return instance;
	}

	/**
	 * Call a given function with the given arguments.
	 *
	 * @param {Function} factory - A closure that factories a concrete.
	 * @param {object<string, *>} [parameters={}] - Additional arguments to inject into the factory when calling it.
	 * @returns {*} The factoried concrete.
	 */
	call(factory, parameters = {}) {
		return factory(this, parameters);
	}

	/**
	 * Make a mass assignment to a given object.
	 *
	 * @param {*} object - An instance that can receive parameters by assignation.
	 * @param {object<string, *>} [parameters={}] - Additional arguments to associate to the instance.
	 * @returns {*} The instance.
	 */
	assign(object, parameters = {}) {
		Object.keys(parameters).forEach((name) => {
			object[name] = parameters[name];
		});

		return object;
	}

	/**
	 * Build a given concrete, either a factory, a class or an object.
	 *
	 * @param {Function|*} concrete - A concrete that can be either instantiated, called or assigned.
	 * @param {object<string, *>} [parameters={}] - Additional arguments to inject into the concrete when instantiating.
	 * @returns {*} The built concrete.
	 */
	build(concrete, parameters = {}) {
		if (this.isInstantiable(concrete)) {
			return this.instantiate(concrete, parameters);
		}

		if (this.isFunction(concrete)) {
			return this.call(concrete, parameters);
		}

		return this.assign(concrete, parameters);
	}

	/**
	 * Decorate a given abstract with a callback.
	 *
	 * @param {string} abstract - The abstract to decorate.
	 * @param {Function} decorator - The decorator function.
	 * @returns {container.Container} The current container instance.
	 */
	decorate(abstract, decorator) {
		__(this).get('pushInto')('decorators', abstract, decorator);

		return __(this).get('proxy');
	}

	/**
	 * Tag a given abstract.
	 *
	 * @param {string|Array<string>} abstract - The abstract(s) to tag.
	 * @param {string} tag - The tag to give to the abstract(s).
	 * @returns {container.Container} The current container instance.
	 */
	tag(abstract, tag) {
		const abstracts = Array.isArray(abstract) ? abstract : [abstract];
		abstracts.forEach((a) => {
			__(this).get('pushInto')('tags', tag, a);
		});

		return __(this).get('proxy');
	}

	/**
	 * Alias an abstract.
	 *
	 * @param {string} alias - The alias to given.
	 * @param {string} abstract - The abstract to associate to the alias.
	 * @returns {container.Container} The current container instance.
	 */
	alias(alias, abstract) {
		return this.bind(alias, () => {
			return this.make(abstract);
		});
	}

	/**
	 * Check if the given string was used as a tag.
	 *
	 * @param {string} tag - The tag name.
	 * @returns {boolean} Indicates if the tag exists.
	 */
	isTag(tag) {
		return Object.prototype.hasOwnProperty.call(__(this).get('tags'), tag);
	}

	/**
	 * Get tagged dependencies from the tag name.
	 *
	 * @param {string} tag - The tag name.
	 * @returns {object<string, *>} The instances associated to the given tag, in a dictionary, mapping the abstract name to the concrete.
	 */
	getTagged(tag) {
		const tagged   = __(this).get('tags')[tag] || [];
		const bindings = {};
		tagged.forEach((binding) => {
			bindings[binding] = this.make(binding);
		});

		return bindings;
	}

	/**
	 * Flush container from attached abstracts and concretes.
	 *
	 * @returns {container.Container} The current container instance.
	 */
	flush() {
		__(this).set('bindings', {});
		__(this).set('singletons', {});
		__(this).set('decorators', {});
		__(this).set('tags', {});

		return this.singleton('app', () => {
			return __(this).get('proxy');
		});
	}

	/**
	 * Throw an error announcing that the given abstract was not found.
	 *
	 * @param {string} abstract - The abstract that was not found.
	 * @throws {TypeError} Indicates that the given abstract was not found in the container.
	 */
	bindingNotFound(abstract) {
		throw new TypeError(`Binding [${abstract}] was not found in the container.`);
	}

	/**
	 * Check if the given file is a valid and existing JavaScript file with a valid extension.
	 *
	 * @param {string} filePath - The file path to load.
	 * @returns {*} The file parsed value, or null if not found.
	 * @throws {Error} Indicates that an error occurred during file loading or parsing.
	 */
	getModule(filePath) {
		try {
			if (typeof filePath === 'string') {
				const value = this.getContext().require(filePath);

				return value && value.__esModule ? value.default : value;
			}

			return null;
		} catch (error) {
			if (error && error.message.startsWith(`Cannot find module "${filePath.toString()}"`)) {
				return null;
			}

			throw error;
		}
	}

}


export default Container;
