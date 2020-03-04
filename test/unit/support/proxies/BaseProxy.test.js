//--------------------------------------------------------
//-- Tests - Unit - Support - Proxies - Base Proxy
//--------------------------------------------------------

import gwt from './BaseProxy.gwt';
import common from './common';


const { given, when, then } = gwt;


beforeEach(() => {
	given.baseProxy();
});


describe('Base proxy', () => {
	common({ given, when, then });
});
