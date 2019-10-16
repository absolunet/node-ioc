//--------------------------------------------------------
//-- Node IoC - Support - Support Service Provider
//--------------------------------------------------------

import ServiceProvider from '../foundation/ServiceProvider';
import DateHelper      from './helpers/DateHelper';
import FileHelper      from './helpers/FileHelper';
import PathHelper      from './helpers/PathHelper';
import StringHelper    from './helpers/StringHelper';
import Faker           from './services/Faker';


// eslint-disable-next-line jsdoc/require-description-complete-sentence
/**
 * The support service provider.
 * It bind these service:
 * <ul>
 *     <li><a href="support.helpers.DateHelper.html">helper.date</a></li>
 *     <li><a href="support.helpers.FileHelper.html">helper.file</a></li>
 *     <li><a href="support.helpers.PathHelper.html">helper.path</a></li>
 *     <li><a href="support.helpers.StringHelper.html">helper.string</a></li>
 *     <li><a href="support.services.Faker.html">faker</a></li>
 * </ul>
 *
 * @memberof support
 * @augments foundation.ServiceProvider
 * @hideconstructor
 */
class SupportServiceProvider extends ServiceProvider {

	/**
	 * Register the service provider.
	 */
	register() {
		this.app.bind('helper.date',   DateHelper);
		this.app.bind('helper.file',   FileHelper);
		this.app.bind('helper.path',   PathHelper);
		this.app.bind('helper.string', StringHelper);
		this.app.singleton('faker',    Faker);
	}

}


export default SupportServiceProvider;
