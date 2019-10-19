//--------------------------------------------------------
//-- Node IoC - View - Services - Drivers - JSRender driver
//--------------------------------------------------------

import Driver from './Driver';


/**
 * JSRender view engine driver.
 *
 * @memberof view.services.Engine.drivers
 * @augments view.services.Engine.drivers.Driver
 * @hideconstructor
 */
class JsRenderDriver extends Driver {

	/**
	 * Class dependencies: <code>['app']</code>.
	 *
	 * @type {Array<string>}
	 */
	static get dependencies() {
		return (super.dependencies || []).concat(['app']);
	}

	/**
	 * @inheritdoc
	 * @private
	 */
	init() {
		this.setEngine(require('jsrender')); // eslint-disable-line global-require
		this.createCustomHelpers();
		this.createCustomTags();
	}

	/**
	 * @inheritdoc
	 */
	make(view) {
		return this.engine.templates(view);
	}

	/**
	 * @inheritdoc
	 */
	render(view, data = {}) {
		return this.make(view).render(data);
	}

	/**
	 * Create custom JSRender helper functions.
	 */
	createCustomHelpers() {
		this.engine.views.helpers('inject', this.app.make.bind(this.app));
		this.engine.views.helpers('config', (...parameters) => {
			return this.app.make('config').get(...parameters);
		});
		this.engine.views.helpers('route', (name, parameters = {}) => {
			const route = this.app.make('router.route').findByName(name);

			return route.compilePath(parameters).compiledPath || '/';
		});
		this.engine.views.helpers('t', (...parameters) => {
			return this.app.make('translator').translate(...parameters);
		});
	}

	/**
	 * Create all JSRender custom tags.
	 */
	createCustomTags() {
		this.engine.views.tags('include', this.includeHandler);
	}

	/**
	 * Handler for the "include" tag.
	 *
	 * @type {{render: Function}}
	 */
	get includeHandler() {
		const self = this;

		return {
			render() {
				const { name, data = {} } = this.tagCtx.props;
				data.slot = data.slot || this.tagCtx.render();

				return self.view.make(name, data);
			}
		};
	}

	/**
	 * View factory.
	 *
	 * @type {view.services.Factory}
	 */
	get view() {
		return this.app.make('view');
	}

}


export default JsRenderDriver;
