//--------------------------------------------------------
//-- Node IoC - Config - Config Repository
//--------------------------------------------------------
'use strict';


const Loader = require('./../../file/services/Loader');
const JavaScriptDriver = require('./../drivers/JavaScriptDriver');
const JsonDriver = require('./../drivers/JsonDriver');
const YamlDriver = require('./../drivers/YamlDriver');


class ConfigLoader extends Loader {

	/**
	 * ConfigLoader constructor.
	 *
	 * @param {Application} app
	 */
	constructor(app) {
		super(app);
		this.addDriver('js', JavaScriptDriver);
		this.addDriver('json', JsonDriver);
		this.addDriver('yaml', YamlDriver);
		this.setDriverAlias('yaml', 'yml');
		this.setDefaultDriver('js');
	}

}

module.exports = ConfigLoader;
