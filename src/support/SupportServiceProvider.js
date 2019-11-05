//--------------------------------------------------------
//-- Node IoC - Support - Support Service Provider
//--------------------------------------------------------

import ServiceProvider  from '../foundation/ServiceProvider';
import MakeMixinCommand from './commands/MakeMixinCommand';
import DateHelper       from './helpers/DateHelper';
import FileHelper       from './helpers/FileHelper';
import PathHelper       from './helpers/PathHelper';
import StringHelper     from './helpers/StringHelper';
import Dumper           from './services/Dumper';
import Faker            from './services/Faker';
import IdeLink          from './enums/IdeLink';


// eslint-disable-next-line jsdoc/require-description-complete-sentence
/**
 * The support service provider.
 * It bind these service:
 * <ul>
 *     <li><a href="support.helpers.DateHelper.html">helper.date</a></li>
 *     <li><a href="support.helpers.FileHelper.html">helper.file</a></li>
 *     <li><a href="support.helpers.PathHelper.html">helper.path</a></li>
 *     <li><a href="support.helpers.StringHelper.html">helper.string</a></li>
 *     <li><a href="support.services.Dumper.html">dumper</a></li>
 *     <li><a href="support.services.Faker.html">faker</a></li>
 *     <li><a href="support.enums.IdeLink.html">ide.link</a></li>
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
		this.bindDateHelper();
		this.bindFileHelper();
		this.bindPathHelper();
		this.bindStringHelper();
		this.bindDumperService();
		this.bindFakerService();
		this.bindIdeLinkEnum();
	}

	/**
	 * Boot the service provider.
	 */
	boot() {
		this.createDumperViewNamespace();
		this.loadCommands([
			MakeMixinCommand
		]);
	}

	/**
	 * Bind date helper.
	 */
	bindDateHelper() {
		this.app.bind('helper.date', DateHelper);
	}

	/**
	 * Bind file helper.
	 */
	bindFileHelper() {
		this.app.bind('helper.file', FileHelper);
	}

	/**
	 * Bind path helper.
	 */
	bindPathHelper() {
		this.app.bind('helper.path', PathHelper);
	}

	/**
	 * Bind string helper.
	 */
	bindStringHelper() {
		this.app.bind('helper.string', StringHelper);
	}

	/**
	 * Bind dumper service.
	 */
	bindDumperService() {
		this.app.singleton('dumper', Dumper);
	}

	/**
	 * Bind faker service.
	 */
	bindFakerService() {
		this.app.singleton('faker', Faker);
	}

	/**
	 * Bind IDE link enum.
	 */
	bindIdeLinkEnum() {
		this.app.singleton('ide.link', IdeLink);
	}

	/**
	 * Create the dumper service view namespace for HTML rendering.
	 */
	createDumperViewNamespace() {
		if (this.app.isBound('view.resolver')) {
			this.app.make('view.resolver').namespace('dumper', this.app.formatPath(__dirname, 'views', 'dumper'));
		}
	}

}


export default SupportServiceProvider;
