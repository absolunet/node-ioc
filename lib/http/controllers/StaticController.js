//--------------------------------------------------------
//-- Node IoC - HTTP - Controllers - Default Controller
//--------------------------------------------------------
'use strict';

const Controller = require('./Controller');
const path       = require('path');


class StaticController extends Controller {

	/**
	 * {@inheritdoc}
	 */
	static get dependencies() {
		return ['file'];
	}

	/**
	 * Handle redirection.
	 *
	 * @param {{folder: string}} defaults
	 * @returns {response}
	 */
	handle({ folder }) {
		const { file } = this.request.params;
		const fullPath = path.join(folder, file);
		if (!this.file.exists(fullPath)) {
			return this.notFound().response;
		}

		return this.response.sendFile(fullPath);
	}

}

module.exports = StaticController;
