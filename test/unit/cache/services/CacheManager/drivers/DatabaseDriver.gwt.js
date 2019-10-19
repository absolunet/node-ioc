//--------------------------------------------------------
//-- Tests - Unit - Cache - Services - Cache Manager - Drivers - Database Driver - GWT
//--------------------------------------------------------

import gwt from './common.gwt';
const { given, when, then, build } = gwt;

import * as fs        from 'fs';
import * as path      from 'path';
import container      from '../../../../container';
import DatabaseDriver from '../../../../../../dist/node/cache/services/CacheManager/drivers/DatabaseDriver';

const databaseFilePath = path.join(__dirname, '..', '..', '..', 'stubs', 'database.sqlite');


//-- Given
//--------------------------------------------------------

given.databaseDriver = (parameters) => {
	given.driver(DatabaseDriver, {
		table: 'cache',
		connection: 'test',
		...parameters
	});
};

given.databaseConfig = () => {
	given.config('database', {
		connections: {
			test: {
				driver: 'sqlite',
				filename: databaseFilePath
			}
		}
	});
};

given.cacheTable = async () => {
	await container.make('db').getConnection('test').schema.createTable('cache', (table) => {
		table.string('key').unique();
		table.text('value').nullable();
		table.timestamp('expires_at').nullable();
	});
};

given.emptyDatabase = () => {
	fs.writeFileSync(databaseFilePath, '');
};


//-- Then
//--------------------------------------------------------

then.dropCacheTable = async () => {
	await container.make('db').getConnection('test').schema.dropTableIfExists('cache');
};


export default build({ given, when, then });
