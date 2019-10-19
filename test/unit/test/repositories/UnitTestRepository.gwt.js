//--------------------------------------------------------
//-- Tests - Unit - Test - Repositories - Unit Test Repository - GWT
//--------------------------------------------------------

import gwt from './common.gwt';
const { given, when, then, build } = gwt;

import UnitTestRepository from '../../../../dist/node/test/repositories/UnitTestRepository';


//-- Given
//--------------------------------------------------------

given.unitTestRepository = () => {
	given.repository(UnitTestRepository);
};


export default build({ given, when, then });
