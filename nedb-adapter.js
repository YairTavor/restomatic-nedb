'use strict';

const q = require('q'),
    Datastore = require('nedb'),
    path = require('path'),

    ACTION_GET = 'get',
    ACTION_CREATE = 'create',
    ACTION_UPDATE = 'update',
    ACTION_DELETE = 'delete',
    ACTION_PARTIAL_UPDATE = 'patch';

/**
 * NeDB Adapter
 *
 * @class NeDbAdapter
 */
class NeDbAdapter {

    constructor () {
        this.options = {
            dbFolder: './db'
        }
    }

    getDB (entity){
        let db = null,
            filePath;

        if(entity && entity.name) {
            filePath = path.join(this.options.dbFolder, entity.name + '.db');
            db = new Datastore({filename: filePath, autoload: true});
        }

        return db;
    }

    find(db, queryObject){
        const deferred = q.defer();

        if(queryObject.entity.id){
            db.findOne({ _id: queryObject.entity.id }, function(err, doc){
                if(err){
                    deferred.reject(err);
                }
                else {
                    deferred.resolve(doc);
                }
            });
        }
        else {
            db.find(queryObject.filter || {}, function (err, docs) {
                if(err){
                    deferred.reject(err);
                }
                else {
                    // TODO: page and sort
                    deferred.resolve(docs);
                }
            });
        }

        return deferred.promise;
    }

    create(db, entity){
        const deferred = q.defer();

        db.insert(entity.body, function (err, docs) {
            if(err){
                deferred.reject(err);
            }
            else {
                deferred.resolve(docs);
            }
        });

        return deferred.promise;
    }

    delete(db, entity){
        const deferred = q.defer(),
            options = { multi: true };
        let condition = {};


        if(entity.id){
            condition = { _id: entity.id };
            options.multi = false;
        }

        db.remove(condition, options, function (err, numRemoved) {
            if(err){
                deferred.reject(err);
            }
            else {
                deferred.resolve(numRemoved);
            }
        });

        return deferred.promise;
    }

    update(db, entity){
        const deferred = q.defer();

        if(entity.id){

        }
        else {

        }

        return deferred.promise;
    }

    /**
     * Execute a query against the db
     *
     * @method query
     * @param {object} queryObject - this is a metadata object with instruction on the query that needs to be executed.
     * @param {string} queryObject.action - the CRUD action to take. Acceptable values are "get", "create", "update"
     *                                      or "delete".
     * @param {Entity} queryObject.entity - this is an Entity object that contains the properties "name" (string),
     *                                      "id" (any), "body" (string or object) and "child" (Entity).
     * @param {number} queryObject.from - used for paging, tells from which index to pull
     * @param {number} queryObject.count - used for paging, tells how many item to pull
     * @param {string} queryObject.sort - the property in the entity to sort by
     * @param {boolean} queryObject.ascending - pass true to sort ascending, otherwise it will sort descending.
     * @returns promise
     */
    query(queryObject) {
        const db = this.getDB(queryObject.entity);
        let promise = q.when(true);

        if(queryObject.action === ACTION_GET){
            promise = this.find(db, queryObject);
        }
        else if (queryObject.action === ACTION_CREATE){
            promise = this.create(db, queryObject.entity);
        }
        else if(queryObject.action === ACTION_DELETE){
            promise = this.delete(db, queryObject.entity);
        }
        else if(queryObject.action === ACTION_UPDATE || queryObject.action === ACTION_PARTIAL_UPDATE){
            promise = this.update(db, queryObject.entity);
        }

        return promise;
    }
}

module.exports = function plugin(restomatic){
    restomatic.server.db = new NeDbAdapter();
    return restomatic.server.db;
};