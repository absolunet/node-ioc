//--------------------------------------------------------
//-- Tests - Unit - Test - Repositories - End-To-End Test Repository - GWT
//--------------------------------------------------------

import gwt from './common.gwt';
const { given, when, then, build } = gwt;

import EndToEndTestRepository from '../../../../dist/node/test/repositories/EndToEndTestRepository';


//-- Given
//--------------------------------------------------------

given.endToEndTestRepository = () => {
	given.repository(EndToEndTestRepository);
};


export default build({ given, when, then });
