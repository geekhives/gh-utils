"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.externalUrl = exports.get = exports.put = exports.post = undefined;

var _axios = require("axios");

var _axios2 = _interopRequireDefault(_axios);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getToken = function getToken() {
    var token = sessionStorage.getItem("token");
    return !_lodash2.default.isNil(token) ? token : false;
};

var transform = function transform(object) {
    var arr = [];

    var _loop = function _loop(p) {
        if (object.hasOwnProperty(p) && !Array.isArray(object[p])) {
            arr.push(encodeURIComponent(p) + "=" + encodeURIComponent(object[p]));
        }

        if (Array.isArray(object[p])) {
            object[p].forEach(function (item, key) {
                arr.push(encodeURIComponent(p + "[" + key + "]") + "=" + encodeURIComponent(item));
            });
        }
    };

    for (var p in object) {
        _loop(p);
    }
    return arr.join("&");
};

var instance = _axios2.default.create({
    timeout: 30000,
    baseURL: process.env.REACT_APP_END_POINT,
    transformRequest: transform,
    transformResponse: function transformResponse(response) {
        try {
            var newResponse = JSON.parse(response);
            if (newResponse.status === 403 && newResponse.message === "Token Expired") {
                sessionStorage.clear();
                alert('Session expired!');
                window.href = "/signin";
            }
            return newResponse;
        } catch (error) {
            console.log(response);
            return {
                status: 500
            };
        }
    },
    validateStatus: function validateStatus(status) {
        return status >= 200;
    }
});

var post = exports.post = function post(uri) {
    return function (args) {
        var token = getToken();
        if (token) {
            instance.defaults.headers.common['Authorization'] = "Bearer " + token;
        }

        return instance.post(uri, args).then(function (response) {
            return response;
        }).catch(function (error) {
            return error;
        });
    };
};

var put = exports.put = function put(uri) {
    return function (args) {
        var token = getToken();
        if (token) {
            instance.defaults.headers.common['Authorization'] = "Bearer " + token;
        }

        return instance.put(uri, args).then(function (response) {
            return response;
        }).catch(function (error) {
            return error;
        });
    };
};

var get = exports.get = function get(uri) {
    return function (params) {
        var token = getToken();
        if (token) {
            instance.defaults.headers.common['Authorization'] = "Bearer " + token;
        }

        return instance.get(uri, {
            params: params
        }).then(function (response) {
            return response;
        }).catch(function (error) {
            return error;
        });
    };
};

var externalUrl = exports.externalUrl = function externalUrl(url) {
    return url + "?token=" + getToken();
};
