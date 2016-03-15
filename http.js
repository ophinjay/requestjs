var Promise = require("./promise");
var Commons = require("./common");

function HTTPRequest(methodName, path) {
    this.xhr = new XMLHttpRequest();
    this.methodName = methodName;
    this.path = path;
}

HTTPRequest.prototype = (function() {

    var queries = function(queries) {
        if (queries) {
            var queryString = Commons.getQueryString(queries);
            if(typeof queryString != "undefined" && queryString.length > 0) {
                this.path += ("?" + queryString);
            }
        }
        return this;
    };

    var headers = function(headers) {
        if (headers) {
            for (var i in headers) {
                this.xhr.setRequestHeader(i, headers[i]);
            }
        }
        return this;
    };

    var send = function(data) {
        var that = this;
        return Promise.create(function(resolve, reject) {
            that.xhr.open(that.methodName, that.path, true);
            that.xhr.onload = function(e) {
                var response = resolveResponse(this);
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
                data = Commons.getQueryString(data);
            } else {
                data = null;
            }
            that.xhr.send(data);
        });
    };

    return {
        send: send,
        headers: headers,
        queries: queries
    };

})();

function resolveResponse(xhr) {
    var contentType = xhr.getResponseHeader("Content-Type");
    var response = xhr.response;
    if (contentType == "application/json") {
        return JSON.parse(response);
    } else {
        return response;
    }
}

module.exports = {
    "get": function(path) {
        return new HTTPRequest("GET", path);
    },
    "post": function(path) {
        return new HTTPRequest("POST", path);
    },
    "put": function(path) {
        return new HTTPRequest("PUT", path);
    },
    "delete": function(path) {
        return new HTTPRequest("DELETE", path);
    }
};
