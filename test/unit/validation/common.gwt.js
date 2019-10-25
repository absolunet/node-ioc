//--------------------------------------------------------
//-- Tests - Unit - Validation - GWT
//--------------------------------------------------------

import gwt from '../common.gwt';
const { given, when, then, build } = gwt;

import container                 from '../container';
import ValidationServiceProvider from '../../../dist/node/validation/ValidationServiceProvider';



//-- Given
//--------------------------------------------------------

given.providersAndDependencies = () => {
	container.register(ValidationServiceProvider);
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
