//--------------------------------------------------------
//-- Tests - Unit - Config - Service provider stub
//--------------------------------------------------------
'use strict';

const ServiceProvider = require('./../../../../../lib/foundation/ServiceProvider');


class FakeServiceProvider extends ServiceProvider {

	register() {
		this.app.bind('test', () => {
			return { foo:'bar' };
		});

		this.app.bind('test2', () => {
			return { foo:'baz' };
		});
	}

}

module.exports = FakeServiceProvider;
