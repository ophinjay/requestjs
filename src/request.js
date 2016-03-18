import { Promise } from "es6-promise";

const REQUEST_TYPES = {
    'json': 'application/json',
    'url': 'application/x-www-form-urlencoded'
};

class HTTPRequest {
    constructor(methodName, path) {
        this.xhr = new XMLHttpRequest();
        this.methodName = methodName;
        this.path = path;
    }
    requestType(type) {
        this.type = type;
        return this;
    }
    queries(queries) {
        if (queries) {
            var queryString = HTTPRequest.getQueryString(queries);
            if (typeof queryString != "undefined" && queryString.length > 0) {
                this.path += ("?" + queryString);
            }
        }
        return this;
    }
    headers(headers) {
        if (headers) {
            for (var i in headers) {
                this.xhr.setRequestHeader(i, headers[i]);
            }
        }
        return this;
    }
    send(data) {
        var that = this;
        return new Promise(function(resolve, reject) {
            that.xhr.open(that.methodName, that.path, true);
            that.xhr.onload = function(e) {
                var response = HTTPRequest.resolveResponse(this);
                if (this.status == 200) {
                    resolve(response);
                } else {
                    reject({
                        "status": this.status,
                        "response": response
                    });
                }
            };
            that.xhr.onerror = function(e) {
                reject(e.target.status);
            };
            if(data) {
                var type = "";
                if(that.type) {
                    type = that.type;
                } else if(that.methodName == "POST" || that.methodName == "PUT") {
                    type = 'url';
                }
                data = HTTPRequest.getRequest(data, type);
            }
            if(that.type && REQUEST_TYPES[that.type]) {
                that.xhr.setRequestHeader('Content-Type', REQUEST_TYPES[that.type]);
            }
            that.xhr.send(data);
        });
    }
    static getRequest(data, type) {
        if (type == 'url') {
            return HTTPRequest.getQueryString(data);
        } else if (type == 'formdata') {
            var formData = new FormData();
            for (var i in data) {
                formData.append(i, data[i]);
            }
            return formData;
        } else if (type == 'json') {
            return JSON.stringify(data);
        } else {
            return data;
        }
    }
    static resolveResponse(xhr) {
        var contentType = xhr.getResponseHeader("Content-Type");
        var response = xhr.response;
        if (/application\/json/.test(contentType)) {
            return JSON.parse(response);
        } else {
            return response;
        }
    }
    static getQueryString(queries) {
        var queryString = "";
        for (var i in queries) {
            queryString += (i + "=" + queries[i] + "&");
        }
        return queryString.replace(/&$/, "");
    }
}

export default {
    get(path) {
            return new HTTPRequest("GET", path);
        },
        post(path) {
            return new HTTPRequest("POST", path);
        },
        put(path) {
            return new HTTPRequest("PUT", path);
        },
        delete(path) {
            return new HTTPRequest("DELETE", path);
        }
};
