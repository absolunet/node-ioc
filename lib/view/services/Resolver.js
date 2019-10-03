//--------------------------------------------------------
//-- Node IoC - View - Services - Resolver
//--------------------------------------------------------
'use strict';

const __ = require('@absolunet/private-registry');


class Resolver {

	/**
	 * {@inheritdoc}
	 */
	static get dependencies() {
		return ['app', 'config', 'file', 'file.engine'];
	}

	/**
	 * {@inheritdoc}
	 */
	init() {
		__(this).set('namespaces', {});
	}

	/**
	 * Find view path by name.
	 *
	 * @param {string} view
	 * @returns {string}
	 * @throws
	 */
	find(view) {
		const viewPath = this.getViewPath(view);

		if (!this.fileEngine.sync.exists(viewPath)) {
			throw new TypeError(`The view "${view}" (${viewPath}) does not exists.`);
		}

		return this.file.driver('text').load(viewPath);
	}

	/**
	 * Get view path by name.
	 *
	 * @param {string} view
	 * @returns {string}
	 */
	getViewPath(view) {
		return this.file.findFirst(this.extensions.map((extension) => {
			return this.app.formatPath(this.getViewBasePath(view), `${view.replace(/^.+::/u, '').replace(/\./gu, '/')}.${extension}`);
		}));
	}

	/**
	 * Get base path of the given view based on the namespace if present.
	 *
	 * @param {string} view
	 * @returns {string}
	 * @throws
	 */
	getViewBasePath(view) {
		if (!view.includes(this.namespaceDelimiter)) {
			return this.path;
		}

		const namespace = view.substr(0, view.indexOf(this.namespaceDelimiter));
		const namespacePath = __(this).get('namespaces')[namespace];

		if (!namespacePath) {
			throw new TypeError(`View namespace "${namespace}" (${view}) does not exist`);
		}

		return namespacePath;
	}

	/**
	 * Register views namespace.
	 *
	 * @param {string} namespace
	 * @param {string} folder
	 * @returns {Resolver}
	 */
	namespace(namespace, folder) {
		__(this).get('namespaces')[namespace] = folder;

		return this;
	}

	/**
	 * @type {FileManager}
	 */
	get file() {
		return __(this).get('file');
	}

	/**
	 * @type {FileEngine}
	 */
	get fileEngine() {
		return __(this).get('file.engine');
	}

	/**
	 * @type {string}
	 */
	get path() {
		return this.app.viewPath();
	}

	/**
	 * @type {ConfigRepository}
	 */
	get config() {
		return __(this).get('config');
	}

	/**
	 * @type {Array<string>}
	 */
	get extensions() {
		return this.config.get('views.extensions', [
			'html',
			'jshtml'
		]);
	}

	/**
	 * @type {string}
	 */
	get namespaceDelimiter() {
		return '::';
	}

}

module.exports = Resolver;
