//--------------------------------------------------------
//-- Tests - Unit - Container
//--------------------------------------------------------

import { Application } from '../../dist/node';

const container = Application.make();


beforeEach(() => {
	container.flush();
});


export default container;
