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
		return (super.dependencies || []).concat(['app', 'file.engine', 'helper.file']);
	}

	/**
	 * {@inheritdoc}
	 */
	init() {
		this.threshold = '25mb';
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

		this.ensureLimitIsUnderThreshold();

		await fs.ensureFile(file);
		await fs.appendFile(file, this.getFullMessage(level, message));
		await this.adjustFile();

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
	 * Ensure the configured file size limit is under the driver threshold.
	 * This will prevent memory leak if removing segment in a too large file
	 */
	ensureLimitIsUnderThreshold() {
		if (this.hasLimit()) {
			const { threshold, config: { limit } } = this;

			const sizeLimit     = this.fileHelper.parseSize(limit);
			const sizeThreshold = this.fileHelper.parseSize(threshold);

			if (sizeLimit > sizeThreshold) {
				throw new TypeError(`Size limit of [${limit}] is over maximum threshold of [${threshold}]`);
			}
		}
	}

	/**
	 * Adjust file content to fit under the configured size limit.
	 *
	 * @returns {Promise<void>}
	 */
	async adjustFile() {
		if (this.hasLimit()) {
			const { fs, config: { path: file, limit } } = this;

			const sizeLimit = this.fileHelper.parseSize(limit);
			const separator = '\n\n';
			let { size } = await fs.stat(file);

			/* eslint-disable no-await-in-loop */
			while (size > sizeLimit) {
				const log = await fs.readFile(file);
				await fs.writeFile(file, log.toString().split(separator).slice(1).join(separator));
				({ size } = await fs.stat(file));
			}
			/* eslint-enable no-await-in-loop */
		}
	}

	/**
	 * Check if configuration has specified size limit.
	 *
	 * @returns {boolean}
	 */
	hasLimit() {
		return Boolean(this.config.limit);
	}

	/**
	 * @type {Fsp}
	 */
	get fs() {
		return __(this).get('file.engine').async;
	}

	/**
	 * @type {FileHelper}
	 */
	get fileHelper() {
		return __(this).get('helper.file');
	}

}


module.exports = FileDriver;
