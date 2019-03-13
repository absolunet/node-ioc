'use strict';


const path = require('path');
const ServiceProvider = require('./../foundation/ServiceProvider');


class BaseConsoleServiceprovider extends ServiceProvider {

	get dir() {
		return __dirname;
	}

	get commandsPath() {
		return path.resolve(this.dir, '..', 'commands');
	}

	boot() {
		this.app.make('command.registrar')
			.addFromFolder(this.commandsPath);
	}

}

module.exports = BaseConsoleServiceprovider;
