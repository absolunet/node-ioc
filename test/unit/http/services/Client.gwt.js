//--------------------------------------------------------
//-- Tests - Unit - HTTP - Services - Client - GWT
//--------------------------------------------------------

import gwt from '../common.gwt';
const { given, when, then, build } = gwt;

import axios     from 'axios';
import container from '../../container';
import Client    from '../../../../dist/node/http/services/Client';

let result;


//-- Given
//--------------------------------------------------------

given.emptyResult = () => {
	result = undefined;
};


//-- When
//--------------------------------------------------------

when.creatingHttpClient = () => {
	when.attempting(() => {
		result = container.make(Client);
	});
};


//-- Then
//--------------------------------------------------------

then.clientHasSamePropertiesAndMethodAsAxios = () => {
	then.shouldNotHaveThrown();
	expect(result).toBeTruthy();
	expect(Object.keys(result)).toStrictEqual(Object.keys(axios.create()));
};


export default build({ given, when, then });
