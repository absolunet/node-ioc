//--------------------------------------------------------
//-- Node IoC - Config - Config Grammar
//--------------------------------------------------------
'use strict';

const os = require('os');


class ConfigGrammar {

	/**
	 * {@inheritdoc}
	 */
	static get dependencies() {
		return ['app', 'env', 'evaluator'];
	}

	/**
	 * Replacement pipeline.
	 *
	 * @type {string[]}
	 */
	get pipeline() {
		return [
			'formatEnvironment',
			'formatPath'
		];
	}

	/**
	 * Replacements list accessor.
	 *
	 * @returns {{ [string]: Array<{search: RegExp, replace: string}> }}
	 */
	get replacements() {
		return {
			path: [
				{ search: /^@\//u, replace: `${this.app.basePath()}/` },
				{ search: /^~\//u, replace: `${os.homedir()}/` }
			],
			environment: [
				{
					search: /\{\{(?<variable>\w+)(?:\|(?<fallback>.*))?\}\}/u,
					replace: (match, variable, fallback) => {
						return this.env.get(variable, fallback || null);
					}
				}
			]
		};
	}

	/**
	 * Format given configuration value.
	 *
	 * @param {*} value
	 * @returns {*}
	 */
	format(value) {
		return this.pipeline.reduce((newValue, action) => {
			return this[action](newValue);
		}, value);
	}

	/**
	 * Parse environment variable in configuration value.
	 *
	 * @param {string} value
	 * @returns {string}
	 */
	formatEnvironment(value) {
		if (typeof value !== 'string') {
			return value;
		}

		return this.replaceValue(value, 'environment');
	}

	/**
	 * Format given path to absolute path.
	 *
	 * @param {string} value
	 * @returns {string}
	 */
	formatPath(value) {
		if (typeof value === 'string') {
			const newFilePath = this.replaceValue(value, 'path');

			if (newFilePath !== value) {
				return this.app.formatPath(newFilePath);
			}
		}

		return value;
	}

	/**
	 * Replace value by the given replacement type configured patterns.
	 *
	 * @param {string} value
	 * @param {string} type
	 * @returns {boolean|null|number|string}
	 */
	replaceValue(value, type) {
		return this.evaluator.evaluate(this.replacements[type].reduce((text, { search, replace }) => {
			return text.replace(search, replace);
		}, value));
	}

}


module.exports = ConfigGrammar;
