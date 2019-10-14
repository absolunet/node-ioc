# @absolunet/ioc

[![npm](https://img.shields.io/npm/v/@absolunet/ioc.svg)](https://www.npmjs.com/package/@absolunet/ioc)
[![npm dependencies](https://david-dm.org/absolunet/node-ioc/status.svg)](https://david-dm.org/absolunet/node-ioc)
[![npms](https://badges.npms.io/%40absolunet%2Fioc.svg)](https://npms.io/search?q=%40absolunet%2Fioc)
[![Travis CI](https://travis-ci.com/absolunet/node-ioc.svg?branch=master)](https://travis-ci.com/absolunet/node-ioc/builds)

[![Code style ESLint](https://img.shields.io/badge/code_style-@absolunet/node-659d32.svg)](https://github.com/absolunet/eslint-config-node)

> IoC: SOLID container for NodeJS application, either for Web server or CLI tool

This packages offers simple IoC container for any NodeJS projects. It allows to do SOLID implementation and easily use project dependencies, as well as writing common packages for multiple projects. It comes with a Jest OOP wrapper for unit, feature and end-to-end tests (PHPUnit and NUnit lookalike), which can be easily done in an IoC container, and AVA for code and structure standards tests.

## Official documentation

See the official documentation at [https://documentation.absolunet.com/docs-node-ioc/en/1.0/intro/getting-started](https://documentation.absolunet.com/docs-node-ioc/en/1.0/intro/getting-started)


## Install

```sh
$ npm install @absolunet/ioc
```


## Usage

```js
// Getting the container
const container = require('@absolunet/ioc');

// Binding an instance to the container
container.bind('foo', () => {
	return { foo: true };
});

// Binding an instance from a class
class Bar {}
container.bind('bar', Bar);

// Binding an instance from an object
const baz = { baz: 42 };
container.bind('baz', baz);

// Binding a singleton
container.singleton('console', () => {
	return window.console;
});

// Getting a registered instance
const injectedFoo = container.make('foo');

// How about making a not registered instance?
const madeObject = container.make(() => { // { obj:'resolved' }
	return { obj: 'resolved' };
});

// How about dependencies injection?
class Injectable {

	static get dependencies() {
		return ['foo'];
	}

	constructor(fooService) {
		this.foo = fooService;
	}

}

const injectable = container.make(Injectable); // Injectable {}
console.log(injectable.foo); // { foo:true }, injection was done from binding done in upper code.

// How about decorating dependencies?
container.decorate('baz', (bazInstance) => {
	if (bazInstance.baz === 42) {
		bazInstance.hasAnswerOfLife = true;
	}

	return bazInstance;
});

const bazDecoratedInstance = container.make('baz'); // { baz:42, hasAnswerOfLife:true }


// This is great, but it can be better!

// Registering service providers
const ProjectServiceProvider = require('./providers/ProjectServiceProvider'); // It binds 'project' and 'project.current' service
container.register(ProjectServiceProvider); // The service provider is registered

container.onBooted(() => {
	const projectService = container.make('project'); // ProjectService {}
	const currentProjectService = container.make('project.current'); // SingleProjectService {}
});
```

## License

MIT © [Absolunet](https://absolunet.com)
