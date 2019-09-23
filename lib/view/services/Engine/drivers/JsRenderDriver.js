//--------------------------------------------------------
//-- Node IoC - View - Services - Drivers - JSRender driver
//--------------------------------------------------------
'use strict';

const __       = require('@absolunet/private-registry');
const Driver   = require('./Driver');


class JsRenderDriver extends Driver {

	/**
	 * {@inheritdoc}
	 */
	static get dependencies() {
		return ['app'];
	}

	/**
	 * {@inheritdoc}
	 */
	init() {
		this.setEngine(require('jsrender')); // eslint-disable-line global-require
		this.createCustomHelpers();
		this.createCustomTags();
	}

	/**
	 * {@inheritdoc}
	 */
	make(view) {
		return this.engine.templates(view);
	}

	/**
	 * {@inheritdoc}
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
	 * @type {{render(): string}}
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
	 * @type {Container}
	 */
	get app() {
		return __(this).get('app');
	}

	/**
	 * @returns {Factory}
	 */
	get view() {
		return this.app.make('view');
	}

}

module.exports = JsRenderDriver;
