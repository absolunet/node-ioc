//--------------------------------------------------------
//-- Tests - Unit - Support - Helpers - Date Helper - GWT
//--------------------------------------------------------
'use strict';

const { given, when, then, build } = require('../common.gwt');

const moment     = require('moment');
const container  = require('../../container');
const DateHelper = require('../../../../src/support/helpers/DateHelper');

let dateHelper;
let result;


//-- Given
//--------------------------------------------------------

given.dateHelper = () => {
	dateHelper = container.make(DateHelper);
};

given.emptyResult = () => {
	result = undefined;
};


//-- When
//--------------------------------------------------------

when.callingHelperAsFunction = () => {
	when.attempting(() => {
		result = dateHelper();
	});
};

when.gettingKeys = () => {
	when.attempting(() => {
		result = Object.keys(dateHelper);
	});
};


//-- Then
//--------------------------------------------------------

then.resultShouldBeMomentInstance = () => {
	then.shouldNotHaveThrown();
	expect(moment.isMoment(result)).toBe(true);
};

then.resultShouldAtLeastMatchMomentKeys = () => {
	then.shouldNotHaveThrown();
	expect(result).toMatchObject(Object.keys(moment));
};


module.exports = build({ given, when, then });
