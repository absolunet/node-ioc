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
		__(this).set('paths',      []);
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

		if (!viewPath) {
			throw new TypeError(`The view "${view}" does not exists.`);
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
		return Boolean(this.getViewPath(view));
	}

	/**
	 * Get view path by name.
	 *
	 * @param {string} view - The view name.
	 * @returns {string|null} The found view path, or null if not found.
	 */
	getViewPath(view) {
		return this.file.findFirst(this.getViewPaths(view)) || null;
	}

	/**
	 * Get view possible paths by name.
	 *
	 * @param {string} view - The view name.
	 * @returns {Array<string>} The possible view file paths.
	 */
	getViewPaths(view) {
		const namespaceRegex = new RegExp(`^.+${this.namespaceDelimiter}`, 'u');
		const viewFileName   = `${view.replace(namespaceRegex, '').replace(/\./gu, '/')}`;

		return this.getViewBasePaths(view).flatMap((basePath) => {
			return this.extensions.flatMap((extension) => {
				return this.app.formatPath(basePath, `${viewFileName}.${extension}`);
			});
		});
	}

	/**
	 * Get base path of the given view based on the namespace if present.
	 *
	 * @param {string} view - The view name.
	 * @returns {Array<string>} The view folder paths.
	 * @throws {TypeError} Indicates that the given view namespace was not found.
	 */
	getViewBasePaths(view) {
		if (!view.includes(this.namespaceDelimiter)) {
			return this.getBasePaths();
		}

		const namespace      = view.slice(0, view.indexOf(this.namespaceDelimiter));
		const namespacePaths = __(this).get('namespaces')[namespace];

		if (!namespacePaths || namespacePaths.length === 0) {
			throw new TypeError(`View namespace "${namespace}" (${view}) does not exist`);
		}

		return [...namespacePaths];
	}

	/**
	 * Register views namespace.
	 *
	 * @param {string} namespace - The namespace.
	 * @param {string} folder - The folder.
	 * @returns {view.services.Resolver} The current resolver instance.
	 */
	namespace(namespace, folder) {
		const namespaces = __(this).get('namespaces');
		namespaces[namespace] = namespaces[namespace] || [];
		namespaces[namespace].push(folder);

		return this;
	}

	/**
	 * Add possible views path.
	 *
	 * @param {string} path - The new views path.
	 * @returns {view.services.Resolver} The current resolver instance.
	 */
	addPath(path) {
		__(this).get('paths').push(path);

		return this;
	}

	/**
	 * Get all views base paths.
	 *
	 * @returns {Array<string>} The view base paths.
	 */
	getBasePaths() {
		return [
			this.app.viewPath(),
			...__(this).get('paths')
		];
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
