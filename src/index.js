import Promise from "es6-promise";

class HTTPRequest {
    constructor(methodName, path) {
        this.xhr = new XMLHttpRequest();
        this.methodName = methodName;
        this.path = path;
    }
    queries(queries) {
        if (queries) {
            var queryString = HTTPRequest.getQueryString(queries);
            if(typeof queryString != "undefined" && queryString.length > 0) {
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
        return Promise.create(function(resolve, reject) {
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
            if (data && that.methodName == "POST") {
                var formData = new FormData();
                for (var i in data) {
                    formData.append(i, data[i]);
                }
                data = formData;
            } else if(data && that.methodName == "PUT") {
                data = HTTPRequest.getQueryString(data);
            } else {
                data = null;
            }
            that.xhr.send(data);
        });
    }
    static resolveResponse(xhr) {
        var contentType = xhr.getResponseHeader("Content-Type");
        var response = xhr.response;
        if (contentType == "application/json") {
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
}