//--------------------------------------------------------
//-- Tests - Unit - Database - Services - Connector - GWT
//--------------------------------------------------------

import gwt from '../../common.gwt';
const { given, when, then, build } = gwt;

import container    from '../../../container';
import Connector    from '../../../../../dist/node/database/services/Connector';
import SqliteDriver from '../../../../../dist/node/database/services/Connector/drivers/SqliteDriver';
import MySQLDriver  from '../../../../../dist/node/database/services/Connector/drivers/MySQLDriver';

let connector;
let result;


//-- Given
//--------------------------------------------------------

given.emptyResult = () => {
	result = undefined;
};

given.connector = () => {
	connector = container.make(Connector);
};


//-- When
//--------------------------------------------------------

when.gettingDriver = (driver) => {
	when.attempting(() => {
		result = connector.driver(driver);
	});
};


//-- Then
//--------------------------------------------------------

then.resultShouldBeInstanceOf = (expected) => {
	then.shouldNotHaveThrown();
	expect(result).toBeInstanceOf(expected);
};

then.shouldHaveReceivedSqliteDriver = () => {
	then.resultShouldBeInstanceOf(SqliteDriver);
};

then.shouldHaveReceivedMySQLDriver = () => {
	then.resultShouldBeInstanceOf(MySQLDriver);
};


export default build({ given, when, then });
