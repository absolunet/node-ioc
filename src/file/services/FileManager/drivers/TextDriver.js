//--------------------------------------------------------
//-- Node IoC - Config - JavaScript Driver
//--------------------------------------------------------

import Driver from './Driver';


/**
 * Plain text driver that does not parse or write in any particular way.
 *
 * @memberof file.services.FileManager.drivers
 * @augments file.services.FileManager.drivers.Driver
 * @hideconstructor
 */
class TextDriver extends Driver {

	/**
	 * @inheritdoc
	 */
	load(file) {
		return this.fileEngine.sync.readFile(file, 'utf8');
	}

	/**
	 * @inheritdoc
	 */
	loadAsync(file) {
		return this.fileEngine.async.readFile(file, 'utf8');
	}

}


export default TextDriver;
