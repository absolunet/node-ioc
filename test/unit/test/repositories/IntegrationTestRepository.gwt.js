//--------------------------------------------------------
//-- Tests - Unit - Test - Repositories - End-To-End Test Repository - GWT
//--------------------------------------------------------

import gwt from './common.gwt';
const { given, when, then, build } = gwt;

import IntegrationTestRepository from '../../../../dist/node/test/repositories/IntegrationTestRepository';


//-- Given
//--------------------------------------------------------

given.IntegrationTestRepository = () => {
	given.repository(IntegrationTestRepository);
};


export default build({ given, when, then });
