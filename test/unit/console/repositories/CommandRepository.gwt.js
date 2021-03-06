//--------------------------------------------------------
//-- Tests - Unit - Console - Repositories - Command Repository
//--------------------------------------------------------

import gwt from '../common.gwt';
const { given, when, then, build } = gwt;

import container         from '../../container';
import CommandRepository from '../../../../dist/node/console/repositories/CommandRepository';
import Command           from '../../../../dist/node/console/Command';

let commandRepository;
let result;


//-- Mocks
//--------------------------------------------------------

const fakeTerminal = {};

const fakeGateService = {
	can: jest.fn((policy) => {
		return policy === 'public';
	})
};

const command = container.make(class extends Command {

	get policies() { return ['public']; }
	get name() { return 'foo'; }

});

const privateCommand = container.make(class extends Command {

	get policies() { return ['private']; }
	get name() { return 'bar'; }

});

const namespaceCommand = container.make(class extends Command {

	get policies() { return ['public']; }
	get name() { return 'namespace:foo'; }

});

const otherNamespaceCommand = container.make(class extends Command {

	get policies() { return ['public']; }
	get name() { return 'namespace:foo'; }

});

const abstractCommand = container.make(class extends Command {

});

const concreteCommandExtendingAbstractCommand = container.make(class extends Command {

});

const AbstractCommandConstructor = class extends Command {

	static get abstract() {
		return this === AbstractCommandConstructor;
	}

	constructor() {
		super();

		return abstractCommand;
	}

	get name() { return 'abstract:command'; }

};

const ConcreteCommandExtendingAbstractCommandConstructor = class extends AbstractCommandConstructor {

	constructor() {
		super();

		return concreteCommandExtendingAbstractCommand;
	}

};


//-- Given
//--------------------------------------------------------

given.fakeTerminal = () => {
	container.singleton('terminal', fakeTerminal);
};

given.fakeGateService = () => {
	container.singleton('gate', fakeGateService);
};

given.commandRepository = () => {
	commandRepository = container.make(CommandRepository);
};

given.emptyResult = () => {
	result = undefined;
};

given.commandAsConstructor = (instance) => {
	const constructor = class extends Command {

		constructor() {
			super();

			return instance;
		}

		get name() {
			return instance.name;
		}

	};
	commandRepository.add(constructor);
};

given.commandAsInstance = (instance) => {
	commandRepository.add(instance);
};

given.command = () => {
	given.commandAsInstance(command);
};

given.privateCommand = () => {
	given.commandAsInstance(privateCommand);
};

given.namespaceCommand = () => {
	given.commandAsInstance(namespaceCommand);
};

given.otherNamespaceCommand = () => {
	given.commandAsInstance(otherNamespaceCommand);
};

given.commandConstructor = () => {
	given.commandAsConstructor(command);
};

given.abstractCommandConstructor = () => {
	commandRepository.add(AbstractCommandConstructor);
};

given.concreteCommandExtendingAbstractCommandConstructor = () => {
	commandRepository.add(ConcreteCommandExtendingAbstractCommandConstructor);
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

when.gettingAllWithPolicies = () => {
	when.gettingAll(true);
};

when.gettingAllGroupedWithPolicies = () => {
	when.gettingAll(true, true);
};

when.gettingAllGroupedWithoutPolicies = () => {
	when.gettingAll(false, true);
};

when.gettingPrivateCommandByName = () => {
	when.attempting(() => {
		result = commandRepository.get('bar');
	});
};

when.checkingIfCommandExists = () => {
	when.attempting(() => {
		result = commandRepository.has('foo');
	});
};


//-- Then
//--------------------------------------------------------

then.resultShouldBe = (expected) => {
	then.shouldNotHaveThrown();
	expect(result).toBe(expected);
};

then.resultShouldInclude = (item) => {
	then.shouldNotHaveThrown();
	expect(result.includes(item)).toBe(true);
};

then.resultShouldNotInclude = (item) => {
	then.shouldNotHaveThrown();
	expect(result.includes(item)).toBe(false);
};

then.shouldHaveCommand = () => {
	then.resultShouldInclude(command);
};

then.shouldHavePrivateCommand = () => {
	then.resultShouldInclude(privateCommand);
};

then.shouldNotHavePrivateCommand = () => {
	then.resultShouldNotInclude(privateCommand);
};

then.shouldNotHaveAbstractCommand = () => {
	then.resultShouldNotInclude(abstractCommand);
};

then.shouldHaveConcreteCommandExtendingAbstractCommandConstructor = () => {
	then.resultShouldInclude(concreteCommandExtendingAbstractCommand);
};

then.shouldHaveCommandAndPrivateCommand = () => {
	then.shouldHaveCommand();
	then.shouldHavePrivateCommand();
};

then.shouldHaveTwoGroups = () => {
	then.shouldNotHaveThrown();
	expect(Object.keys(result).length).toBe(2);
};

then.shouldHaveCommandInGroup = (item, group) => {
	then.shouldNotHaveThrown();
	expect(result[group]).toBeTruthy();
	expect(result[group].includes(item)).toBe(true);
};

then.shouldHaveCommandInGlobalGroup = () => {
	then.shouldHaveCommandInGroup(command, '');
};

then.shouldHavePrivateCommandInGlobalGroup = () => {
	then.shouldHaveCommandInGroup(privateCommand, '');
};

then.shouldHaveNamespaceCommandInNamespaceGroup = () => {
	then.shouldHaveCommandInGroup(namespaceCommand, 'namespace');
};

then.shouldHaveOtherNamespaceCommandInNamespaceGroup = () => {
	then.shouldHaveCommandInGroup(otherNamespaceCommand, 'namespace');
};

then.shouldNotHavePrivateCommandInAnyGroup = () => {
	then.shouldNotHaveThrown();
	const hasPrivateCommand = Object.keys(result).some((group) => {
		return group.includes(privateCommand);
	});
	expect(hasPrivateCommand).toBe(false);
};

then.resultShouldBePrivateCommand = () => {
	then.resultShouldBe(privateCommand);
};


export default build({ given, when, then });
