//--------------------------------------------------------
//-- Tests - Unit - Translation - GWT
//--------------------------------------------------------

import gwt from '../common.gwt';
const { given, when, then, build } = gwt;

import container                  from '../container';
import TranslationServiceProvider from '../../../dist/node/translation/TranslationServiceProvider';


//-- Given
//--------------------------------------------------------

given.providersAndDependencies = () => {
	container.register(TranslationServiceProvider);
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
