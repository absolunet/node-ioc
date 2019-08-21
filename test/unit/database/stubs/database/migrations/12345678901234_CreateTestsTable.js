//--------------------------------------------------------
//-- Test - Unit - Database - Stubs - Database - Migrations - CreateTestsTable
//--------------------------------------------------------
'use strict';

const Migration = require('../../../../../../lib/database/Migration');


class CreateTestsTable extends Migration {

	/**
	 * {@inheritdoc}
	 */
	async up({ schema }) {
		await schema.createTable('tests', (table) => {
			table.uuid('id').primary();
			table.timestamps();
		});
	}

	/**
	 * {@inheritdoc}
	 */
	async down({ schema }) {
		await schema.dropTableIfExists('tests');
	}

}


module.exports = CreateTestsTable;
