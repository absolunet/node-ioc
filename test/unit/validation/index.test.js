//--------------------------------------------------------
//-- Tests - Unit - Validation
//--------------------------------------------------------
'use strict';

const joi                       = require('@hapi/joi');
const container                 = require('../common');
const ValidationServiceProvider = require('../../../lib/validation/ValidationServiceProvider');


describe('Node IoC - Validation', () => {

	beforeEach(() => {
		container.register(ValidationServiceProvider);
		container.bootIfNotBooted();
	});


	describe('Validator', () => {

		let validator;

		beforeEach(() => {
			validator = container.make('validator');
		});

		test('Validator exposes Joi', () => {
			expect(validator).toBe(joi);
		});

	});

});
