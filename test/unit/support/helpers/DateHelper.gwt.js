//--------------------------------------------------------
//-- Tests - Unit - Support - Helpers - Date Helper - GWT
//--------------------------------------------------------

import gwt from '../common.gwt';
const { given, when, then, build } = gwt;

import moment     from 'moment';
import container  from '../../container';
import DateHelper from '../../../../dist/node/support/helpers/DateHelper';

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


export default build({ given, when, then });
