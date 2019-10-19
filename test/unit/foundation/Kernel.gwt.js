//--------------------------------------------------------
//-- Tests - Unit - Foundation - Kernel - GWT
//--------------------------------------------------------

import gwt from './common.gwt';
const { given, when, then, build } = gwt;

import container from '../container';
import Kernel    from '../../../dist/node/foundation/Kernel';

import NotImplementedError from '../../../dist/node/foundation/exceptions/NotImplementedError';

import CacheServiceProvider       from '../../../dist/node/cache/CacheServiceProvider';
import DatabaseServiceProvider    from '../../../dist/node/database/DatabaseServiceProvider';
import HttpServiceProvider        from '../../../dist/node/http/HttpServiceProvider';
import LogServiceProvider         from '../../../dist/node/log/LogServiceProvider';
import SecurityServiceProvider    from '../../../dist/node/security/SecurityServiceProvider';
import TestServiceProvider        from '../../../dist/node/test/TestServiceProvider';
import TranslationServiceProvider from '../../../dist/node/translation/TranslationServiceProvider';
import ValidationServiceProvider  from '../../../dist/node/validation/ValidationServiceProvider';
import ViewServiceProvider        from '../../../dist/node/view/ViewServiceProvider';

let kernel;


//-- Given
//--------------------------------------------------------

given.productionEnvironment = () => {
	container.setEnvironment('production');
};

given.kernel = () => {
	kernel = container.make(Kernel);
};

given.emptyKernel = () => {
	kernel = undefined;
};


//-- When
//--------------------------------------------------------

when.bootingContainer = () => {
	when.attempting(() => {
		container.boot();
	});
};

when.makingKernel = () => {
	when.attempting(() => {
		kernel = container.make(Kernel);
	});
};

when.handling = () => {
	when.attempting(() => {
		kernel.handle();
	});
};

when.terminating = () => {
	kernel.terminate();
};


//-- Then
//--------------------------------------------------------

then.coreProvidersShouldHaveBeenRegistered = () => {
	then.shouldNotHaveThrown();
	expect(container.isRegistered(CacheServiceProvider)).toBe(true);
	expect(container.isRegistered(DatabaseServiceProvider)).toBe(true);
	expect(container.isRegistered(HttpServiceProvider)).toBe(true);
	expect(container.isRegistered(LogServiceProvider)).toBe(true);
	expect(container.isRegistered(SecurityServiceProvider)).toBe(true);
	expect(container.isRegistered(TranslationServiceProvider)).toBe(true);
	expect(container.isRegistered(ValidationServiceProvider)).toBe(true);
	expect(container.isRegistered(ViewServiceProvider)).toBe(true);
};

then.coreDevelopmentProvidersShouldHaveBeenRegistered = () => {
	then.shouldNotHaveThrown();
	expect(container.isRegistered(TestServiceProvider)).toBe(true);
};

then.coreDevelopmentProvidersShouldNotHaveBeenRegistered = () => {
	expect(container.isRegistered(TestServiceProvider)).toBe(false);
};

then.shouldHaveThrownNotImplementedError = () => {
	then.exceptionShouldBeInstanceOf(NotImplementedError);
};


export default build({ given, when, then });
