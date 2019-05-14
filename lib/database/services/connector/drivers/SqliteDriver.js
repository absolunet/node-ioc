//--------------------------------------------------------
//-- Node IoC - Database - Connector - Sqlite Driver
//--------------------------------------------------------
'use strict';


const __ = require('@absolunet/private-registry');
const Driver = require('./Driver');


class SqliteDriver extends Driver {

    static get dependencies() {
        return ['config.grammar'].concat(super.dependencies || []);
    }

    constructor(grammar, ...args)  {
        super(...args);
    }

    get client() {
        return 'sqlite3';
    }

    mapConfig(config) {
        const data = super.mapConfig(config);
        data.connection = {
            filename: this.configGrammar.formatPath(config.database)
        };

        data.useNullAsDefault = true;

        return data;
    }

    get configGrammar() {
        return __(this).get('config.grammar');
    }

}

module.exports = SqliteDriver;
