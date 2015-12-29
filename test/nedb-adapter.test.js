'use strict';

var assert = require('assert'),
    fs = require('fs'),
    mockRestomatic = {server: {db: null}},
    dbAdapter = require('../nedb-adapter')(mockRestomatic),

    ACTION_GET = 'get',
    ACTION_CREATE = 'create',
    ACTION_UPDATE = 'update',
    ACTION_DELETE = 'delete',

    ID_PROPERTY = '_id',
    CLEAN_AFTER_TEST =  true;

describe('nedb-adapter', function () {

    after(function() {
        var path = './db/';

        if(CLEAN_AFTER_TEST) {
            // clean db files and folders created by this test
            fs.readdirSync(path).forEach(function (file) {
                fs.unlinkSync(path + file);
            });
            fs.rmdirSync(path);
        }
    });

    describe('general', function () {
        it('should be a restomatic plugin', function () {
            // check that the db was injected into restomatic
            assert.equal(dbAdapter, mockRestomatic.server.db);
        });

        it('should have a query function', function () {
            // the api of restomatic expect the db adapter to have a 'query' function that returns a promise.
            assert.ok(typeof dbAdapter.query === 'function');

            // just for the test, we will pass an empty object that should return a promise.
            assert.ok(typeof dbAdapter.query({}).then === 'function');
        });
    });

    describe('CRUD actions', function () {
        var testUserId = null;

        /* ------======: CREATE :======------ */
        it('create a single simple object', function () {
            var queryObject = {
                action: ACTION_CREATE,
                entity: {
                    name: 'user',
                    id: null,
                    body: { name: 'test' },
                    child: null
                }
            };

            return dbAdapter.query(queryObject).then(function (result) {
                assert.equal(result.name, 'test');
                assert.ok(result.hasOwnProperty(ID_PROPERTY));
                testUserId = result[ID_PROPERTY];
                return result;
            });
        });

        it('create a list of simple objects', function(){
            var queryObject = {
                action: ACTION_CREATE,
                entity: {
                    name: 'user',
                    id: null,
                    body: [{ name: 'foo'}, {name: 'bar'}],
                    child: null
                }
            };

            return dbAdapter.query(queryObject).then(function (result) {
                assert.equal(result.length, 2);
                return result;
            });
        });

        // TODO: test compound object create (for example, user.priviledges)

        /* ------======: GET :======------ */
        it('get all objects', function(){
            var queryObject = {
                action: ACTION_GET,
                entity: {
                    name: 'user',
                    id: null,
                    body: null,
                    child: null
                }
            };

            return dbAdapter.query(queryObject).then(function (result) {
                assert.equal(result.length, 3);
                return result;
            });
        });

        it('get one by id', function(){
            var queryObject = {
                action: ACTION_GET,
                entity: {
                    name: 'user',
                    id: testUserId,
                    body: null,
                    child: null
                }
            };

            return dbAdapter.query(queryObject).then(function (result) {
                assert.equal(result.name, 'test');
                return result;
            });
        });

        // TODO: test paging
        // TODO: test sorting
        // TODO: test filters
        // TODO: test compound fetch

        /* ------======: UPDATE :======------ */
        // TODO: test update

        /* ------======: DELETE :======------ */
        it('delete one by id', function(){
            var queryObject = {
                action: ACTION_DELETE,
                entity: {
                    name: 'user',
                    id: testUserId,
                    body: null,
                    child: null
                }
            };

            return dbAdapter.query(queryObject).then(function (result) {
                assert.equal(result, 1);
                return result;
            });
        });

        it('delete all', function(){
            var queryObject = {
                action: ACTION_DELETE,
                entity: {
                    name: 'user',
                    id: null,
                    body: null,
                    child: null
                }
            };

            return dbAdapter.query(queryObject).then(function (result) {
                assert.equal(result, 2);
                return result;
            });
        });

        // TODO: test delete with filter
    });
});
