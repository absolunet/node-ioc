//--------------------------------------------------------
//-- Test - Unit - Database - Stubs - Database - Factories - TestFactory
//--------------------------------------------------------
'use strict';

const ModelFactory = require('../../../../../../lib/database/Factory');


class TestFactory extends ModelFactory {

	/**
	 * {@inheritdoc}
	 */
	get model() {
		return 'test';
	}

	/**
	 * {@inheritdoc}
	 */
	make() {
		return {
			//
		};
	}

}


module.exports = TestFactory;
