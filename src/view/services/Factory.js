//--------------------------------------------------------
//-- Node IoC - View - Services - Factory
//--------------------------------------------------------


/**
 * View factory that generate a fully rendered template as string from view paths and view-model.
 *
 * @memberof view.services
 * @hideconstructor
 */
class Factory {

	/**
	 * Class dependencies: <code>['view.resolver', 'view.engine']</code>.
	 *
	 * @type {Array<string>}
	 */
	static get dependencies() {
		return ['view.resolver', 'view.engine'];
	}

	/**
	 * Create a rendered template from a view name and data.
	 *
	 * @param {string} name - The view name.
	 * @param {*} data - The view-model data.
	 * @returns {string} The rendered view template.
	 */
	make(name, data = {}) {
		const path = this.viewResolver.getViewPath(name);

		return this.viewEngine.render(this.viewResolver.find(name), {
			...data,
			__meta: {
				name,
				path
			}
		});
	}

}


export default Factory;
