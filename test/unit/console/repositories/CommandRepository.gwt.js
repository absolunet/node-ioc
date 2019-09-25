//--------------------------------------------------------
//-- Tests - Unit - Console - Repositories - Command Repository
//--------------------------------------------------------
'use strict';

const { given, when, then, build } = require('../common.gwt');

const container = require('../../container');
const CommandRepository = require('../../../../lib/console/repositories/CommandRepository');

let commandRepository;
let result;


//-- Mocks
//--------------------------------------------------------

const fakeTerminal = {};


//-- Given
//--------------------------------------------------------

given.fakeTerminal = () => {
	container.singleton('terminal', fakeTerminal);
};

given.commandRepository = () => {
	commandRepository = container.make(CommandRepository);
};

given.emptyResult = () => {
	result = undefined;
};


//-- When
//--------------------------------------------------------

when.gettingAll = (...parameters) => {
	when.attempting(() => {
		result = commandRepository.all(...parameters);
	});
};

when.gettingAllWithoutPolicies = () => {
	when.gettingAll(false);
};

when.gettingAllGrouped = () => {
	when.gettingAll(undefined, true);
};

when.gettingAllGroupedWithoutPolicies = () => {
	when.gettingAll(false, true);
};

//-- Then
//--------------------------------------------------------



module.exports = build({ given, when, then });
