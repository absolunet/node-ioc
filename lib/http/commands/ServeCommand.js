//--------------------------------------------------------
//-- Node IoC - HTTP - Command - List
//--------------------------------------------------------
'use strict';

const Command = require('./../../console/Command');


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
	handle() {
		const app = this.server.make();

		this.terminal.spacer();
		this.info(`This is serving on port ${this.option('port')}...`);

		app.use(this.middleware);
		app.use(this.router.generate());
		app.listen(this.option('port'));

		return this.wait();
	}

	wait() {
		return new Promise(() => {}); // eslint-disable-line no-empty-function
	}

	/**
	 * Express middleware to print the request in console.
	 *
	 * @type {Function}
	 */
	get middleware() {
		return (request, response, next) => {
			response.on('finish', () => {
				this.terminal.echoIndent(`[${(new Date()).toLocaleString()}] [${response.statusCode}] ${request.method} ${request.url}`);
			});
			next();
		};
	}

}

module.exports = ServeCommand;
