//--------------------------------------------------------
//-- Node IoC - Log - Services - Logger - Drivers - Stack Driver
//--------------------------------------------------------
'use strict';

const Driver = require('./Driver');


class StackDriver extends Driver {

	/**
	 * {@inheritdoc}
	 */
	static get dependencies() {
		return (super.dependencies || []).concat(['app']);
	}

	/**
	 * {@inheritdoc}
	 */
	init() {
		this.setConfig({
			channels: []
		});
	}

	/**
	 * {@inheritdoc}
	 */
	log(level, message, context) {
		const { channels = [], ignore_exceptions: ignoreExceptions = false } = this.config;
		const method = ignoreExceptions ? 'logWithChannel' : 'unsafeLogWithChannel';

		return Promise.all(channels.map(async (channel) => {
			try {
				await this.app.make('log')[method](channel, level, message, context);
			} catch (error) { // eslint-disable-line no-empty-block
			}
		}));
	}

}


module.exports = StackDriver;
