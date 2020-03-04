//--------------------------------------------------------
//-- Tests - Unit - Support - Proxies - Base Proxy - GWT
//--------------------------------------------------------

import gwt from './common.gwt';
import BaseProxy from '../../../../dist/node/support/proxies/BaseProxy';


const { given, when, then, build } = gwt;


//-- Given
//--------------------------------------------------------

given.baseProxy = () => {
	given.proxy(BaseProxy);
};


export default build({ given, when, then });
