//--------------------------------------------------------
//-- Node IoC - Console - Option
//--------------------------------------------------------
'use strict';

const Argument = require('./Argument');
/**
 * Option argument class.
 * Represents a string option that look like "some:command --option=value" in a command.
 *
 * @memberof console.models
 * @augments console.models.Argument
 */


class Option extends Argument {}

module.exports = Option;