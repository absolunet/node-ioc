//--------------------------------------------------------
//-- Node IoC - Config - JavaScript Driver
//--------------------------------------------------------

import Driver from './Driver';


/**
 * JavaScript driver that allows .js file interpretation on load. However, it writes in plain text.
 *
 * @memberof file.services.FileManager.drivers
 * @augments file.services.FileManager.drivers.Driver
 * @hideconstructor
 */
class JavaScriptDriver extends Driver {

	/**
	 * Class dependencies: <code>['app', 'file.engine']</code>.
	 *
	 * @type {Array<string>}
	 */
	static get dependencies() {
		return (super.dependencies || []).concat(['app']);
	}

	/**
	 * @inheritdoc
	 */
	load(file) {
		return this.app.getContext().require(file);
	}

	/**
	 * @inheritdoc
	 */
	loadAsync(file) {
		return Promise.resolve(this.app.getContext().require(file));
	}

}


export default JavaScriptDriver;
