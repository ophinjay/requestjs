import { expect, assert } from 'chai';
import request from '../src/request';
import { get, post } from '../server/responses';
import { assign } from "../server/utils";

function errorHandler(done, err) {
    if (err.status) {
        done(new Error(JSON.stringify(err)));
    } else {
        done(err);
    }
}

function getErrorHandler(doneFn) {
    return errorHandler.bind(null, doneFn);
}

describe('GET', () => {
    it('should fetch response at path /results', done => {
        request.get("/results").send().then(data => {
            expect(data).to.deep.equal(get["/results"]);
            done();
        }).catch(getErrorHandler(done));
    });
    it('should return 404 for path /result', done => {
        request.get("/result").send().then(data => {
            errorHandler({
                status: 200
            }, done);
        }).catch(err => {
            if (err.status && err.status == "404") {
                done();
            } else {
                errorHandler(done, err);
            }
        });
    });
    it('should return queries passed', done => {
        var queries = {
            test: "test",
            stilltest: "testingstill"
        }
        request.get("/query").queries(queries).send().then(data => {
            expect(data).to.deep.equal(queries);
            done();
        }).catch(getErrorHandler(done));
    });
    it('should return non-json results', done => {
        request.get("/nonjson").send().then(data => {
            expect(data).to.equal(get["/nonjson"]);
            done();
        }).catch(getErrorHandler(done));
    });
});

describe('POST', () => {
    describe('Response multiplied by 13', () => {
        it('should extract from json request', done => {
            request.post("/results").requestType('json').send(post["/results"].request).then(data => {
                expect(data).to.deep.equal(post["/results"].response);
                done();
            }).catch(getErrorHandler(done));
        });
        it('should extract from url-encoded request', done => {
            request.post("/results").requestType('url').send(post["/results"].request).then(data => {
                expect(data).to.deep.equal(post["/results"].response);
                done();
            }).catch(getErrorHandler(done));
        });
    });
    it('should return header', done => {
        var headers = {
            header: "10"
        };
        request.post("/headers").headers(headers).send().then(data => {
            expect(data).to.deep.equal(headers);
            done();
        }).catch(getErrorHandler(done));
    });
    it('should return header, query and body', done => {
        var headers = {
            header: "10"
        };
        var queries = {
            query: "20"
        };
        var body = post["/results"].request;
        var result = assign({}, headers, queries, body);
        request.post("/collate").headers(headers).queries(queries).send(body).then(data => {
            expect(data).to.deep.equal(result);
            done();
        }).catch(getErrorHandler(done));
    });
});
