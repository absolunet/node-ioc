//--------------------------------------------------------
//-- Node IoC - Foundation - Exceptions - Handler - Drivers - View Driver
//--------------------------------------------------------

import Driver from './Driver';


/**
 * Pretty Error exception render driver.
 */
class ViewDriver extends Driver {

	/**
	 * Class dependencies: <code>['app']</code>.
	 *
	 * @type {Array<string>}
	 */
	static get dependencies() {
		return ['app'];
	}

	/**
	 * @inheritdoc
	 */
	render(exception, request, response) {
		response.end(this.renderView(exception));
	}

	/**
	 * Render view template, if possible.
	 * If not, fallback on text.
	 *
	 * @param {Error} exception - The exception to render.
	 * @returns {string} The rendered exception.
	 */
	renderView(exception) {
		if (this.app.isBound('view') && this.app.isBound('view.resolver')) {
			const viewResolver = this.app.make('view.resolver');
			let viewName = `errors.${exception.status}`;

			if (!viewResolver.exists(viewName)) {
				viewName = 'errors.generic';
			}

			if (viewResolver.exists(viewName)) {
				return this.app.make('view').make(viewName, { exception });
			}
		}

		return this.renderText();
	}

	/**
	 * Render plain text.
	 *
	 * @returns {string} The rendered text.
	 */
	renderText() {
		const text = 'Something went wrong...';

		if (this.app.isBound('translator')) {
			return this.app.make('translator').translate(text);
		}

		return text;
	}

}


export default ViewDriver;
