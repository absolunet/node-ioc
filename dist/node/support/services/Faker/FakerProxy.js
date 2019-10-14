//--------------------------------------------------------
//-- Node IoC - Support - Services - Faker proxy
//--------------------------------------------------------
'use strict';

const ForwardProxy = require('../../proxies/ForwardProxy');
/**
 * The faker proxy handler that forwards calls to the Faker instance.
 *
 * @memberof support.services
 * @augments support.proxies.ForwardProxy
 * @hideconstructor
 */


class FakerProxy extends ForwardProxy {}

module.exports = FakerProxy;