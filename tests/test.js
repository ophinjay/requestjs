import { expect, assert } from 'chai';
import request from '../src/request';
import {get, post } from '../server/responses';

function errorHandler(err, done) {
    if (err.status) {
        done(new Error(JSON.stringify(err)));
    } else {
        done(err);
    }
}

describe('GET', function() {
    it('should fetch response at path /results', function(done) {
        request.get("/results").send().then(function(data) {
            expect(data).to.deep.equal(get["/results"]);
            done();
        }).catch(errorHandler.bind(done));
    });
    it('should return 404 for path /result', function(done) {
        request.get("/result").send().then(function(data) {
            errorHandler({
                status: 200
            }, done);
        }).catch(function(err) {
            if (err.status && err.status == "404") {
                done();
            } else {
                errorHandler(err, done);
            }
        });
    });
    it('should return queries passed', function(done) {
        var queries = {
            test: "test",
            stilltest: "testingstill"
        }
        request.get("/query").queries(queries).send().then(function(data) {
            expect(data).to.deep.equal(queries);
            done();
        }).catch(errorHandler.bind(done));
    });
    it('should return non-json results', function(done) {
        request.get("/nonjson").send().then(function(data) {
            expect(data).to.equal(get["/nonjson"]);
            done();
        }).catch(errorHandler.bind(done));
    });
});

describe('POST', function() {
    describe('Response multiplied by 13', function() {
        it('should extract from json request', function(done) {
            request.post("/results").requestType('json').send(post["/results"].request).then(function(data) {
                expect(data).to.deep.equal(post["/results"].response);
                done();
            }).catch(errorHandler.bind(done));
        });
        it('should extract from url-encoded request', function(done) {
            request.post("/results").requestType('url').send(post["/results"].request).then(function(data) {
                expect(data).to.deep.equal(post["/results"].response);
                done();
            }).catch(errorHandler.bind(done));
        });
    });
    it('should return header', function(done) {
    	var headers = {
    		header: 10
    	};
        request.post("/headers").headers(headers).send().then(function(data) {
            expect(data).to.deep.equal(headers);
            done();
        }).catch(errorHandler.bind(done));
    });
});
