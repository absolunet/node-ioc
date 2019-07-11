//--------------------------------------------------------
//-- Node IoC - HTTP - Command - List
//--------------------------------------------------------
'use strict';

const Command = require('./../../console/Command');
const nodemon = require('nodemon');


class ServeCommand extends Command {

	/**
	 * {@inheritdoc}
	 */
	static get dependencies() {
		return ['server', 'router'];
	}

	/**
	 * {@inheritdoc}
	 */
	get policies() {
		return ['public'];
	}

	/**
	 * {@inheritdoc}
	 */
	get name() {
		return 'serve';
	}

	/**
	 * {@inheritdoc}
	 */
	get description() {
		return 'Serve the application with an Express server';
	}

	/**
	 * {@inheritdoc}
	 */
	get options() {
		return [
			['port', 8080, 'Port to use to serve the application']
		];
	}

	/**
	 * {@inheritdoc}
	 */
	get flags() {
		return [
			['daemon'],
			['silent'],
			['start-silent']
		];
	}

	/**
	 * {@inheritdoc}
	 */
	handle() {
		if (!this.flag('silent') && !this.flag('start-silent')) {
			this.terminal.spacer();
			this.info(`This is serving on port ${this.option('port')}...`);
		}

		if (this.flag('daemon')) {
			return this.startDaemon();
		}

		return this.startServer();
	}

	/**
	 * Start Express server.
	 *
	 * @returns {Promise}
	 */
	startServer() {
		const app = this.server.make();

		app.use(this.middleware);
		app.use(this.router.generate());
		app.listen(this.option('port'));

		return this.wait();
	}

	/**
	 * Start daemon server with nodemon.
	 *
	 * @returns {Promise}
	 */
	startDaemon() {
		const commandParts = [
			this.yargs.argv.$0,
			this.name,
			`--port=${this.option('port')}`,
			'--start-silent'
		];

		const silent = this.flag('silent');

		if (silent) {
			commandParts.push('--silent');
		}

		const nodemonProcess = nodemon(commandParts.join(' '));

		if (!silent) {
			nodemonProcess.on('restart', () => {
				this.info('Daemon is reloading files...');
			});
		}

		return new Promise((resolve) => {
			nodemonProcess.on('quit', resolve);
		});
	}

	/**
	 * Wait indefinitely.
	 *
	 * @returns {Promise}
	 */
	wait() {
		return new Promise(() => {}); // eslint-disable-line no-empty-function
	}

	/**
	 * Express middleware that prints the request in console.
	 *
	 * @type {Function}
	 */
	get middleware() {
		return (request, response, next) => {
			if (!this.flag('silent')) {
				response.on('finish', () => {
					this.terminal.echoIndent(`[${(new Date()).toLocaleString()}] [${response.statusCode}] ${request.method} ${request.url}`);
				});
			}
			next();
		};
	}

}

module.exports = ServeCommand;
