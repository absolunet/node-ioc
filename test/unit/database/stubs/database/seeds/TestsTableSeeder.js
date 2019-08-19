//--------------------------------------------------------
//-- Test - Unit - Database - Stubs - Database Seeds - TestsTableSeeder
//--------------------------------------------------------
'use strict';

const Seeder = require('../../../../../../lib/database/Seeder');


class TestsTableSeeder extends Seeder {

	/**
	 * {@inheritdoc}
	 */
	async seed() {
		await this.factory('test').save();
	}

}


module.exports = TestsTableSeeder;
