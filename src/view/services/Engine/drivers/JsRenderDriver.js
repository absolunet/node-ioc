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
		this.createInjectHelper();
		this.createConfigHelper();
		this.createRouteHelper();
		this.createTranslateHelper();
		this.createDumpHelper();
	}

	/**
	 * Create "inject" helper function.
	 */
	createInjectHelper() {
		this.engine.views.helpers('inject', (...parameters) => {
			return this.app.make(...parameters);
		});
	}

	/**
	 * Create "config" helper function.
	 */
	createConfigHelper() {
		this.engine.views.helpers('config', (...parameters) => {
			return this.app.make('config').get(...parameters);
		});
	}

	/**
	 * Create "route" helper function.
	 */
	createRouteHelper() {
		this.engine.views.helpers('route', (name, parameters = {}) => {
			const route = this.app.make('router.route').findByName(name);

			return route.compilePath(parameters).compiledPath || '/';
		});
	}

	/**
	 * Create "t" helper function.
	 */
	createTranslateHelper() {
		this.engine.views.helpers('t', (...parameters) => {
			return this.app.make('translator').translate(...parameters);
		});
	}

	/**
	 * Create "dump" helper function.
	 */
	createDumpHelper() {
		const { app } = this;
		this.engine.views.helpers('dump', function(...parameters) {
			const dumper = app.make('dumper');
			let meta;
			let current = this; // eslint-disable-line consistent-this

			while (!meta && current) {
				({ __meta: meta } = current.data);
				current = current.parent;
			}

			if (meta) {
				return dumper.getDumpForFile(meta.path, ...parameters);
			}

			return dumper.getDump(...parameters);
		});
	}

	/**
	 * Create all JSRender custom tags.
	 */
	createCustomTags() {
		this.createIncludeTag();
	}

	/**
	 * Create "include" tag.
	 * JSRender already defines this tag, but an overwrite is necessary in order to use the view resolver.
	 */
	createIncludeTag() {
		const self = this;

		this.engine.views.tags('include', {
			render() {
				const { name, data = {}, inline, escape } = this.tagCtx.props;
				data.slot = data.slot || this.tagCtx.render();

				let render = self.view.make(name, data);

				if (inline) {
					render = render.replace(/\n/gu, '');
				}

				if (escape) {
					render = render.replace(/\\/gu, '\\\\');
				}

				return render;
			}
		});

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
