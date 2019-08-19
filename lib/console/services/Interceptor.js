//--------------------------------------------------------
//-- Node IoC - Console - Services - Interceptor
//--------------------------------------------------------
'use strict';

const __               = require('@absolunet/private-registry');
const ansiRegexFactory = require('ansi-regex');
const intercept        = require('intercept-stdout');


class Interceptor {

	/**
	 * {@inheritdoc}
	 */
	static get dependencies() {
		return ['terminal.interceptor.capture'];
	}

	/**
	 * {@inheritdoc}
	 */
	init() {
		const interceptors = [];
		__(this).set('interceptors', interceptors);
		__(this).set('interceptor', (content) => {
			const editable = __(this).get('editable');
			const newContent = interceptors.reduce((value, closure) => {
				const transformedValue = closure(this.styleCleaner(value));

				return editable && typeof transformedValue !== 'undefined' ? transformedValue : value;
			}, content);

			return __(this).get('mute') ? '' : newContent;
		});

		this
			.enable()
			.unmute()
			.removeStyle()
			.uneditable();
	}

	/**
	 * Add an stdout interceptor.
	 *
	 * @param {Function} closure
	 * @param {number|null} [index]
	 * @returns {Interceptor}
	 */
	add(closure, index = null) {
		const interceptors = __(this).get('interceptors');
		interceptors.splice(index === null ? interceptors.length : index, 0, closure);

		return this;
	}

	/**
	 * Remove an stdout interceptor.
	 *
	 * @param {Function} closure
	 * @returns {Interceptor}
	 */
	remove(closure) {
		const interceptors = __(this).get('interceptors');

		if (interceptors.includes(closure)) {
			interceptors.splice(interceptors.indexOf(closure), 1);
		}

		return this;
	}

	/**
	 * Remove all existing interceptors.
	 *
	 * @returns {Interceptor}
	 */
	removeAll() {
		__(this).get('interceptors').splice(0);

		return this;
	}

	/**
	 * Start capture.
	 *
	 * @param {boolean} [state]
	 * @param {boolean} [mute]
	 * @returns {Interceptor}
	 */
	startCapture(mute = true) {
		const { captureInterceptor } = this;

		captureInterceptor.flush();

		this.add(captureInterceptor.handler);

		if (mute) {
			this.mute();
		}

		return this;
	}

	/**
	 * Stop capture and get the output.
	 *
	 * @param {boolean} [unmute]
	 * @returns {Array<string>}
	 */
	stopCapture(unmute = true) {
		this.remove(this.captureInterceptor.handler);

		if (unmute) {
			this.unmute();
		}

		return this.output;
	}

	/**
	 * Enable interceptors.
	 *
	 * @returns {Interceptor}
	 */
	enable() {
		if (!__(this).get('disable')) {
			__(this).set('disable', intercept((content) => {
				return __(this).get('interceptor')(content);
			}));
		}

		return this;
	}

	/**
	 * Disable interceptors.
	 *
	 * @returns {Interceptor}
	 */
	disable() {
		const disable = __(this).get('disable');

		if (disable) {
			disable();
		}

		return this;
	}

	/**
	 * Mute stdout in process but keep interceptors enabled.
	 *
	 * @param {boolean} [state]
	 * @returns {Interceptor}
	 */
	mute(state = true) {
		__(this).set('mute', state);

		return this;
	}

	/**
	 * Unmute stdout in process.
	 *
	 * @returns {Interceptor}
	 */
	unmute() {
		return this.mute(false);
	}

	/**
	 * Allow interceptors to edit output content.
	 *
	 * @param {boolean} [state]
	 * @returns {Interceptor}
	 */
	editable(state = true) {
		__(this).set('editable', state);

		return this;
	}

	/**
	 * Deny interceptors to edit output content.
	 *
	 * @returns {Interceptor}
	 */
	uneditable() {
		this.editable(false);

		return this;
	}

	/**
	 * Keep styles in content when passing it to interceptors.
	 *
	 * @param {boolean} [state]
	 * @returns {Interceptor}
	 */
	keepStyle(state = true) {
		__(this).set('style', state);

		return this;
	}

	/**
	 * Remove styles in content when passing it to interceptor.
	 *
	 * @returns {Interceptor}
	 */
	removeStyle() {
		this.keepStyle(false);

		return this;
	}

	/**
	 * Style cleaner.
	 *
	 * @see keepStyle
	 * @see removeStyle
	 * @type {Function}
	 */
	get styleCleaner() {
		return (content) => {
			if (__(this).get('style')) {
				return content;
			}

			return content.replace(ansiRegexFactory(), '');
		};
	}

	/**
	 * @type {CaptureInterceptor}
	 */
	get captureInterceptor() {
		return __(this).get('terminal.interceptor.capture');
	}

	/**
	 * Captured output.
	 *
	 * @type {Array<string>}
	 */
	get output() {
		return this.captureInterceptor.capture;
	}

}

module.exports = Interceptor;
