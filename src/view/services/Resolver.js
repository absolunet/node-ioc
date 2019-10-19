//--------------------------------------------------------
//-- Node IoC - View - Services - Resolver
//--------------------------------------------------------

import __ from '@absolunet/private-registry';


/**
 * View file resolver.
 * It allows to resolve path of a given view name.
 *
 * @memberof view.services
 * @hideconstructor
 */
class Resolver {

	/**
	 * Class dependencies: <code>['app', 'config', 'file']</code>.
	 *
	 * @type {Array<string>}
	 */
	static get dependencies() {
		return ['app', 'config', 'file'];
	}

	/**
	 * @inheritdoc
	 * @private
	 */
	init() {
		__(this).set('namespaces', {});
	}

	/**
	 * Find view path by name.
	 *
	 * @param {string} view - The view name.
	 * @returns {string} The view content.
	 * @throws {TypeError} Indicates that the given view was not found.
	 */
	find(view) {
		const viewPath = this.getViewPath(view);

		if (!this.file.exists(viewPath)) {
			throw new TypeError(`The view "${view}" (${viewPath}) does not exists.`);
		}

		return this.file.driver('text').load(viewPath);
	}

	/**
	 * Check if view file exists by name.
	 *
	 * @param {string} view - The view name.
	 * @returns {boolean} Indicates that the view file exists and may be rendered.
	 */
	exists(view) {
		return this.file.exists(this.getViewPath(view));
	}

	/**
	 * Get view path by name.
	 *
	 * @param {string} view - The view name.
	 * @returns {string} The view file path.
	 */
	getViewPath(view) {
		return this.file.findFirst(this.extensions.map((extension) => {
			return this.app.formatPath(this.getViewBasePath(view), `${view.replace(/^.+::/u, '').replace(/\./gu, '/')}.${extension}`);
		}));
	}

	/**
	 * Get base path of the given view based on the namespace if present.
	 *
	 * @param {string} view - The view name.
	 * @returns {string} The view folder path.
	 * @throws {TypeError} Indicates that the given view namespace was not found.
	 */
	getViewBasePath(view) {
		if (!view.includes(this.namespaceDelimiter)) {
			return this.path;
		}

		const namespace = view.slice(0, view.indexOf(this.namespaceDelimiter));
		const namespacePath = __(this).get('namespaces')[namespace];

		if (!namespacePath) {
			throw new TypeError(`View namespace "${namespace}" (${view}) does not exist`);
		}

		return namespacePath;
	}

	/**
	 * Register views namespace.
	 *
	 * @param {string} namespace - The namespace.
	 * @param {string} folder - The folder.
	 * @returns {view.services.Resolver} The current resolver instance.
	 */
	namespace(namespace, folder) {
		__(this).get('namespaces')[namespace] = folder;

		return this;
	}

	/**
	 * The view path.
	 *
	 * @type {string}
	 */
	get path() {
		return this.app.viewPath();
	}

	/**
	 * The supported file extensions.
	 *
	 * @type {Array<string>}
	 */
	get extensions() {
		return this.config.get('view.extensions', [
			'html',
			'jshtml'
		]);
	}

	/**
	 * The namespace delimiter.
	 *
	 * @type {string}
	 */
	get namespaceDelimiter() {
		return '::';
	}

}


export default Resolver;
