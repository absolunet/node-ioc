//--------------------------------------------------------
//-- Node IoC - Foundation - Data - Collection Mapper
//--------------------------------------------------------
'use strict';

class CollectionMapper {

	/**
	 * Dependencies descriptor.
	 *
	 * @returns {string[]}
	 */
	static get dependencies() {
		return ['app'];
	}

	/**
	 * Single item mapper resolvable instance accessor.
	 *
	 * @returns {string|Mapper|function<string|Mapper>}
	 */
	get mapper() {
		throw new TypeError('Accessor [mapper] must be implemented. It should return a Mapper resolvable element.');
	}

	/**
	 * Map collection through item mapper.
	 *
	 * @param {*[]} collection
	 * @returns {Model[]}
	 */
	map(collection = []) {
		return collection.map((item) => {
			return this.app.make(this.mapper).map(item);
		});
	}

}


module.exports = CollectionMapper;
