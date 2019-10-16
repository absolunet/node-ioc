//--------------------------------------------------------
//-- Node IoC - Log - Services - Logger - Drivers - Stack Driver
//--------------------------------------------------------

import Driver from './Driver';


/**
 * Driver that logs into a suite of configured channels at once.
 *
 * @memberof log.services.Logger.drivers
 * @augments log.services.Logger.drivers.Driver
 * @hideconstructor
 */
class StackDriver extends Driver {

	/**
	 * Class dependencies: <code>['app', 'log.level']</code>.
	 *
	 * @type {Array<string>}
	 */
	static get dependencies() {
		return (super.dependencies || []).concat(['app']);
	}

	/**
	 * @inheritdoc
	 * @private
	 */
	init() {
		this.setConfig({
			channels: []
		});
	}

	/**
	 * @inheritdoc
	 */
	log(level, message, context) {
		const { channels = [], ignore_exceptions: ignoreExceptions = false } = this.config;
		const method = ignoreExceptions ? 'logWithChannel' : 'unsafeLogWithChannel';

		return Promise.all(channels.map(async (channel) => {
			try {
				await this.app.make('log')[method](channel, level, message, context);
			} catch (error) {
				//
			}
		}));
	}

}


export default StackDriver;
