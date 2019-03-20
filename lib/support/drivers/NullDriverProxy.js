//--------------------------------------------------------
//-- Node IoC - Support - Drivers - Null Driver proxy
//--------------------------------------------------------
'use strict';


class NullClassConstructor {}

class NullDriverProxy {

	constructor() {
		return new Proxy(NullClassConstructor, this);
	}

	construct() {
		return this.newProxy();
	}

	get(obj, prop) {
		if (obj[prop]) {
			return obj[prop];
		}

		if (typeof prop === 'symbol') {
			return null;
		}

		return this.newProxy();
	}

	apply() {
		return this.newProxy();
	}

	has() {
		return false;
	}

	set(obj, prop) {
		return true;
	}

	defineProperty() {
		return true;
	}

	getPrototypeOf(obj) {
		return Object.prototype;
	}

	setPrototypeOf() {
		return true;
	}

	isExtensible() {
		return false;
	}

	preventExtensions() {
		return true;
	}

	deleteProperty() {
		return true;
	}

	ownKeys(obj) {
		console.log(obj, Object.keys(obj));

		return Object.keys(obj);
	}

	newProxy() {
		const { constructor:NullProxy } = this;

		return new NullProxy();
	}

}

const p = new Proxy( {},{ apply() { return 'bob' }} );

module.exports = NullDriverProxy;
