//--------------------------------------------------------
//-- Tests - Unit - Foundation - Kernel - GWT
//--------------------------------------------------------
'use strict';

const { given, when, then, build } = require('./common.gwt');

const container = require('../container');
const Kernel    = require('../../../lib/foundation/Kernel');

const NotImplementedError = require('../../../lib/foundation/exceptions/NotImplementedError');

const CacheServiceProvider       = require('../../../lib/cache/CacheServiceProvider');
const DatabaseServiceProvider    = require('../../../lib/database/DatabaseServiceProvider');
const HttpServiceProvider        = require('../../../lib/http/HttpServiceProvider');
const LogServiceProvider         = require('../../../lib/log/LogServiceProvider');
const SecurityServiceProvider    = require('../../../lib/security/SecurityServiceProvider');
const TestServiceProvider        = require('../../../lib/test/TestServiceProvider');
const TranslationServiceProvider = require('../../../lib/translation/TranslationServiceProvider');
const ValidationServiceProvider  = require('../../../lib/validation/ValidationServiceProvider');
const ViewServiceProvider        = require('../../../lib/view/ViewServiceProvider');

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


module.exports = build({ given, when, then });
