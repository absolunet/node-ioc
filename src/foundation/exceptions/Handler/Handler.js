//--------------------------------------------------------
//-- Node IoC - Foundation - Exceptions - Handler
//--------------------------------------------------------

import __                from '@absolunet/private-registry';
import hasDriver         from '../../../support/mixins/hasDriver';
import OuchDriver        from './drivers/OuchDriver';
import PrettyErrorDriver from './drivers/PrettyErrorDriver';


/**
 * Main exception handler.
 *
 * @memberof foundation.exceptions
 * @augments support.mixins.HasDriver
 * @hideconstructor
 */
class Handler extends hasDriver() {

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
		super.init();
		__(this).set('exceptions', []);

		this.addDriver('prettyError', PrettyErrorDriver);
		this.addDriver('ouch', OuchDriver);
		this.setDriverAlias('prettyError', 'console');
		this.setDriverAlias('ouch', 'http');
	}

	/**
	 * Handle the given exception.
	 *
	 * @param {Error|string} exception - The handled exception.
	 * @param {request} [request] - The current HTTP request.
	 * @param {response} [response] - The current HTTP response.
	 * @returns {Promise} The async process promise.
	 */
	async handle(exception, request, response) {
		__(this).get('exceptions').push(exception);

		await this.report(exception);

		await this.render(exception, request, response);
	}

	/**
	 * Report an exception.
	 *
	 * @param {Error|string} exception - The exception to report.
	 * @returns {Promise} The async process promise.
	 */
	async report(exception) {
		if (this.app.isBound('log')) {
			try {
				await this.app.make('log').error(exception.stack);
			} catch (error) {
				await this.handleReportException(error);
			}
		}
	}

	/**
	 * Render an exception.
	 *
	 * @param {Error|string} exception - The handled exception.
	 * @param {request} [request] - The current HTTP request.
	 * @param {response} [response] - The current HTTP response.
	 * @returns {Promise} The async process promise.
	 */
	async render(exception, request, response) {
		if (response && response.write && response.json && response.status) {
			await this.renderResponse(exception, request, response);
		} else {
			await this.renderConsole(exception);
		}
	}

	/**
	 * Render an exception as an HTTP response.
	 *
	 * @param {Error|string} exception - The handled exception.
	 * @param {request} [request] - The current HTTP request.
	 * @param {response} [response] - The current HTTP response.
	 * @returns {Promise} The async process promise.
	 */
	async renderResponse(exception, request, response) {
		const status = exception.status || 500;
		response.status(status);

		if (this.app.environment !== 'production') {
			await this.driver('http').render(exception, request, response);
		} else {
			let content = 'Something went wrong...';

			if (this.app.isBound('translator')) {
				content = this.app.make('translator').translate(content);
			}

			if (this.app.isBound('view') && this.app.isBound('view.resolver')) {
				const viewFactory = this.app.make('view');
				const viewResolver = this.app.make('view.resolver');
				let viewName = `errors.${status}`;

				if (!viewResolver.exists(viewName)) {
					viewName = 'errors.generic';
				}

				if (viewResolver.exists(viewName)) {
					content = viewFactory.make(viewName, { exception });
				}
			}

			response.write(content);
		}
	}

	/**
	 * Render exception in console.
	 *
	 * @param {Error|string} exception - The handled exception.
	 * @returns {Promise} The async process promise.
	 */
	async renderConsole(exception) {
		await this.driver('console').render(exception);
	}

	/**
	 * Handle a report exception.
	 *
	 * @param {Error|string} exception - The reported exception.
	 * @returns {Promise} The async process promise.
	 */
	async handleReportException(exception) {
		__(this).get('exceptions').push(exception);
		await this.driver('console').render(exception);
	}

	/**
	 * Check if it has already handle an exception during the given request.
	 *
	 * @type {boolean}
	 */
	get hadException() {
		return Boolean(this.lastException);
	}

	/**
	 * Last exception accessor.
	 *
	 * @type {Error|string}
	 */
	get lastException() {
		const exceptions = __(this).get('exceptions');

		return exceptions[exceptions.length - 1];
	}

}


export default Handler;
