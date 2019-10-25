//--------------------------------------------------------
//-- Node IoC - Container - Proxy
//--------------------------------------------------------

import __        from '@absolunet/private-registry';
import BaseProxy from '../support/proxies/BaseProxy';


/**
 * Container proxy that allows dynamic resolving without using container.make().
 *
 * @example
 * container.bind('foo', 'bar');
 * container.make('foo'); // "bar"
 * container.foo; // "bar"
 *
 * @memberof container
 * @augments support.proxies.BaseProxy
 * @hideconstructor
 */
class ContainerProxy extends BaseProxy {


	/**
	 * @inheritdoc
	 */
	get(object, property) {
		const value = super.get(object, property);

		if (typeof value === 'undefined' && typeof property !== 'symbol') {
			try {
				return object.make(property);
			} catch (error) { // eslint-disable line-no-empty-block
			}
		}

		return value;
	}

	/**
	 * Container property check handler.
	 *
	 * @param {container.Container} object - The current container.
	 * @param {string} property - The property name.
	 * @returns {boolean} Indicates that the property exists in the container or that the binding exists.
	 */
	has(object, property) {
		return __(this).get('has')(object, property) || Boolean(__(object).get('bindings')[property]) || object.isTag(property);
	}

}


export default ContainerProxy;
