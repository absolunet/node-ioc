//--------------------------------------------------------
//-- Tests - Unit - Test - Repositories - Test Repository - GWT
//--------------------------------------------------------

import gwt from './common.gwt';
const { given, when, then, build } = gwt;

import TestRepository from '../../../../dist/node/test/repositories/TestRepository';


//-- Mocks
//--------------------------------------------------------

const ScopedTestRepository = class extends TestRepository {

	get scope() { return 'unit'; }

};


//-- Given
//--------------------------------------------------------

given.testRepository = () => {
	given.repository(TestRepository);
};

given.scopedTestRepository = () => {
	given.repository(ScopedTestRepository);
};


export default build({ given, when, then });
