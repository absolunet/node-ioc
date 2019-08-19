//--------------------------------------------------------
//-- Node IoC - Log - Services - Logger - Drivers - File Driver
//--------------------------------------------------------
'use strict';

const __     = require('@absolunet/private-registry');
const Driver = require('./Driver');


class FileDriver extends Driver {

	/**
	 * {@inheritdoc}
	 */
	static get dependencies() {
		return (super.dependencies || []).concat(['app', 'file.engine']);
	}

	/**
	 * {@inheritdoc}
	 */
	init() {
		this.setConfig({
			path: this.app.storagePath(['logs', 'ioc.log']),
			level: 'debug'
		});
	}

	/**
	 * {@inheritdoc}
	 */
	async log(level, message) {
		const { fs, config: { path: file } } = this;

		await fs.ensureFile(file);
		await fs.appendFile(file, this.getFullMessage(level, message));

		return this;
	}

	/**
	 * Get full message to log.
	 *
	 * @param {number} level
	 * @param {string} message
	 * @returns {string}
	 */
	getFullMessage(level, message) {
		const formattedLevel   = this.getFormattedLevel(level);
		const formattedDate    = this.getFormattedDate();
		const formattedVersion = this.getFormattedVersion();
		const formattedMessage = this.getFormattedMessage(`\n ${message}`);

		return `${formattedLevel} [${formattedDate}] [${formattedVersion}]${formattedMessage}\n\n`;
	}

	/**
	 * Get current formatted date.
	 *
	 * @returns {string}
	 */
	getFormattedDate() {
		return (new Date()).toISOString().replace('T', ' ').replace(/\.(?<milli>\d+)Z/u, ',$<milli>');
	}

	/**
	 * Get formatted level.
	 *
	 * @param {number} level
	 * @returns {string}
	 */
	getFormattedLevel(level) {
		return (typeof level === 'string' ? level : this.LEVEL[level]).toLowerCase().padEnd(this.getLevelMaxLength());
	}

	/**
	 * Get formatted message with proper spacers.
	 *
	 * @param {string} message
	 * @returns {string}
	 */
	getFormattedMessage(message) {
		return (typeof message === 'undefined' ? 'undefined' : message)
			.toString()
			.replace(/(?<lines>\n+)/gu, `$<lines>${this.getSpacer()}`);
	}

	/**
	 * Get formatted application version.
	 *
	 * @returns {string}
	 */
	getFormattedVersion() {
		return `Version ${this.app.version}`;
	}

	/**
	 * Get maximum string length of available levels.
	 *
	 * @returns {number}
	 */
	getLevelMaxLength() {
		return Math.max(...this.LEVEL.keys().map(({ length }) => {
			return length;
		}));
	}

	/**
	 * Get white space based on maximum level length.
	 *
	 * @returns {string}
	 */
	getSpacer() {
		return ' '.repeat(this.getLevelMaxLength());
	}

	/**
	 * @type {Fsp}
	 */
	get fs() {
		return __(this).get('file.engine').async;
	}

}


module.exports = FileDriver;
