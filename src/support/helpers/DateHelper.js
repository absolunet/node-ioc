//--------------------------------------------------------
//-- Node IoC - Support - Helpers - Date
//--------------------------------------------------------

/**
 * Date helper.
 *
 * @memberof support.helpers
 * @hideconstructor
 */
class DateHelper {

	/**
	 * Class dependencies: <code>['app']</code>.
	 *
	 * @type {Array<string>}
	 */
	static get dependencies() {
		return ['app'];
	}

	/**
	 * DateHelper constructor.
	 *
	 * @param {foundation.Application} app - The application.
	 * @returns {moment} The Moment.js class.
	 */
	constructor(app) {
		const { moment } = this;

		if (app.isBound('config')) {
			const config = app.make('config');
			const locale = config.get('app.locale', config.get('app.fallback_locale'));

			if (locale) {
				moment.locale(locale);
			}
		}

		return moment;
	}

	/**
	 * Moment package.
	 *
	 * @type {moment}
	 */
	get moment() {
		return require('moment'); // eslint-disable-line global-require
	}

}


export default DateHelper;
