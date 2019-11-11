//--------------------------------------------------------
//-- Node IoC - Config - Config Service Provider
//--------------------------------------------------------

import ServiceProvider from '../foundation/ServiceProvider';
import FileEngine      from './services/FileEngine';
import FileManager     from './services/FileManager';
import Async           from './systems/Async';
import Sync            from './systems/Sync';


// eslint-disable-next-line jsdoc/require-description-complete-sentence
/**
 * The file service provider.
 * It bind these following services:
 * <ul>
 *     <li><a href="file.services.FileManager.html">file</a></li>
 *     <li><a href="file.services.FileEngine.html">file.engine</a></li>
 *     <li><a href="file.systems.Async.html">file.system.async</a></li>
 *     <li><a href="file.systems.Sync.html">file.system.sync</a></li>
 * </ul>
 *
 * @memberof file
 * @augments foundation.ServiceProvider
 * @hideconstructor
 */
class FileServiceProvider extends ServiceProvider {

	/**
	 * @inheritdoc
	 */
	get name() {
		return 'Node IoC - File';
	}

	/**
	 * Register the service provider.
	 */
	register() {
		this.bindFileManager();
		this.bindFileEngine();
		this.bindAsyncFileSystem();
		this.bindSyncFileSystem();
	}

	/**
	 * Bind file manager service.
	 */
	bindFileManager() {
		this.app.singleton('file', FileManager);
	}

	/**
	 * Bind file engine service.
	 */
	bindFileEngine() {
		this.app.singleton('file.engine', FileEngine);
	}

	/**
	 * Bind async file system.
	 */
	bindAsyncFileSystem() {
		this.app.singleton('file.system.async', Async);
	}

	/**
	 * Bind sync file system.
	 */
	bindSyncFileSystem() {
		this.app.singleton('file.system.sync', Sync);
	}

}


export default FileServiceProvider;
