//--------------------------------------------------------
//-- Tests - Unit - Database - Services - Connector - GWT
//--------------------------------------------------------
'use strict';

const { given, when, then, build } = require('../../common.gwt');

const container    = require('../../../container');
const Connector    = require('../../../../../src/database/services/Connector');
const SqliteDriver = require('../../../../../src/database/services/Connector/drivers/SqliteDriver');

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


module.exports = build({ given, when, then });
