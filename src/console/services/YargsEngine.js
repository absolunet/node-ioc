//--------------------------------------------------------
//-- Node IoC - Console - Services - Yargs Engine
//--------------------------------------------------------


/**
 * Yargs engine.
 *
 * @memberof console.services
 * @hideconstructor
 */
class YargsEngine {

	/**
	 * YargsEngine constructor.
	 *
	 * @returns {yargs} Yargs module.
	 */
	constructor() {
		return require('yargs'); // eslint-disable-line global-require
	}

}


export default YargsEngine;
