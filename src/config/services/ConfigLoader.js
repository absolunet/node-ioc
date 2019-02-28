//--------------------------------------------------------
//-- Spark IoC - Config - Config Repository
//--------------------------------------------------------
'use strict';

const fs = require('fs');
const path = require('path');
const jsYaml = require('js-yaml');


class ConfigLoader {

	/**
	 * Load file data.
	 *
	 * @param {string} file
	 * @returns {*}
	 */
	load(file) {
		const type = this.getFileType(file);
		const data = type === 'js' ? require(file) : fs.readFileSync(file, 'utf8'); // eslint-disable-line global-require

		return this.parse(data, type);
	}

	/**
	 * Load first existing file.
	 *
	 * @param {string[]} files
	 * @returns {*}
	 */
	loadFirst(files) {
		const file = files.find((f) => {
			return fs.existsSync(f);
		});
		if (!file) {
			throw new Error('No file in the given collection exists.');
		}

		return this.load(file);
	}

	/**
	 * Get file type based on its name.
	 *
	 * @param {string} file
	 * @returns {string}
	 */
	getFileType(file) {
		return path.extname(file).substr(1);
	}

	/**
	 * Parse configuration file based on its type.
	 *
	 * @param {string|*} data
	 * @param {string} type
	 * @returns {*}
	 * @throws Error
	 */
	parse(data, type) {
		switch (type) {

			case 'js':
				return data;

			case 'yml':
			case 'yaml':
				return jsYaml.safeLoad(data);

			case 'json':
				return JSON.parse(data);

			default:
				throw new Error(`Configuration file type [${type}] is not yet handled.`);

		}

	}

}

module.exports = ConfigLoader;
