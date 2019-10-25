//--------------------------------------------------------
//-- Tests - Unit - Test - Repositories - Feature Test Repository - GWT
//--------------------------------------------------------

import gwt from './common.gwt';
const { given, when, then, build } = gwt;

import FeatureTestRepository from '../../../../dist/node/test/repositories/FeatureTestRepository';


//-- Given
//--------------------------------------------------------

given.featureTestRepository = () => {
	given.repository(FeatureTestRepository);
};


export default build({ given, when, then });
