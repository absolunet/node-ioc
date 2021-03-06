//--------------------------------------------------------
//-- Tests - Unit - View - GWT
//--------------------------------------------------------

import gwt from '../common.gwt';
const { given, when, then, build } = gwt;

import container           from '../container';
import ViewServiceProvider from '../../../dist/node/view/ViewServiceProvider';


//-- Given
//--------------------------------------------------------

given.providersAndDependencies = () => {
	container.register(ViewServiceProvider);
};

given.bootedContainer = () => {
	container.bootIfNotBooted();
};


//-- When
//--------------------------------------------------------

when.bootingContainer = () => {
	container.bootIfNotBooted();
};


//-- Then
//--------------------------------------------------------

then.serviceShouldBeResolvable = (service) => {
	expect(container.isBound(service)).toBe(true);
	expect(container.make(service)).toBeTruthy();
};

then.shouldHaveSingleton = (service) => {
	then.serviceShouldBeResolvable(service);
	const instance = container.make(service);
	expect(container.make(service)).toBe(instance);
};


export default build({ given, when, then });
