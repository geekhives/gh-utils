'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.toss = exports.redirect = exports.isNumber = exports.getFirstMessage = exports.transform = exports.loadAPI = exports.secToTime = exports.sessionStorageGetItem = exports.sessionStoreSetItem = exports.amountFormat = undefined;
exports.api = api;
exports.watchApiReponse = watchApiReponse;

var _effects = require('redux-saga/effects');

var _reactSAlert = require('react-s-alert');

var _reactSAlert2 = _interopRequireDefault(_reactSAlert);

var _History = require('./History');

var _History2 = _interopRequireDefault(_History);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _marked = /*#__PURE__*/regeneratorRuntime.mark(api),
    _marked2 = /*#__PURE__*/regeneratorRuntime.mark(watchApiReponse);

var amountFormat = exports.amountFormat = function amountFormat(amount) {
    if (!amount) return 0;
    return amount.replace(/./g, function (c, i, a) {
        return i && c !== "." && (a.length - i) % 3 === 0 ? "," + c : c;
    });
};

var sessionStoreSetItem = exports.sessionStoreSetItem = function sessionStoreSetItem(key, object) {
    try {
        var items = sessionStorage.getItem(key);
        if (items === null) {
            return sessionStorage.setItem(key, JSON.stringify(object));
        }
        var objects = JSON.parse(sessionStorage.getItem(key));
        var newObjects = Object.assign({}, object, objects);
        sessionStorage.setItem(key, JSON.stringify(newObjects));
    } catch (error) {
        console.log(error);
    }
};

var sessionStorageGetItem = exports.sessionStorageGetItem = function sessionStorageGetItem(key) {
    try {
        return JSON.parse(sessionStorage.getItem(key)) || {};
    } catch (error) {
        return {};
    }
};

var secToTime = exports.secToTime = function secToTime(duration) {
    //let milliseconds = parseInt((duration%1000)/100, 10)
    var seconds = parseInt(duration % 60, 10);
    var minutes = parseInt(duration / 60 % 60, 10);
    var hours = parseInt(duration / (60 * 60) % 24, 10);

    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds;
};

var loadAPI = exports.loadAPI = function loadAPI(id, src, cb) {
    var js,
        fjs = document.getElementsByTagName("script")[0];
    if (document.getElementById(id)) return;
    js = document.createElement("script");
    js.id = id;
    js.src = src;
    js.onload = cb;
    fjs.parentNode.insertBefore(js, fjs);
};

var transform = exports.transform = function transform(object) {
    var arr = [];

    var _loop = function _loop(p) {
        if (object.hasOwnProperty(p) && !Array.isArray(object[p])) {
            arr.push(encodeURIComponent(p) + "=" + encodeURIComponent(object[p]));
        }

        if (Array.isArray(object[p])) {
            object[p].forEach(function (item, key) {
                arr.push(encodeURIComponent(p + '[' + key + ']') + "=" + encodeURIComponent(item));
            });
        }
    };

    for (var p in object) {
        _loop(p);
    }
    return arr.join("&");
};

var getFirstMessage = exports.getFirstMessage = function getFirstMessage(data) {
    var firstMessage = "";
    var x = 0;

    Object.keys(data).map(function (i) {
        if (x === 0) {
            firstMessage = data[i];
        }
        return x++;
    });
    return firstMessage;
};

function api(_ref) {
    var api = _ref.api,
        _ref$args = _ref.args,
        args = _ref$args === undefined ? {} : _ref$args,
        loading = _ref.loading;
    var response;
    return regeneratorRuntime.wrap(function api$(_context) {
        while (1) {
            switch (_context.prev = _context.next) {
                case 0:
                    _context.next = 2;
                    return (0, _effects.put)({ type: "IS_LOADING", loadingType: loading });

                case 2:
                    _context.next = 4;
                    return (0, _effects.call)(api, args);

                case 4:
                    response = _context.sent;
                    _context.next = 7;
                    return (0, _effects.put)({ type: "IS_LOADING", loadingType: null });

                case 7:
                    return _context.abrupt('return', response);

                case 8:
                case 'end':
                    return _context.stop();
            }
        }
    }, _marked, this);
}

function watchApiReponse() {
    var response = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var responseOk = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee, this);
    });
    var responseNotOkay = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        return regeneratorRuntime.wrap(function _callee2$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee2, this);
    });
    return regeneratorRuntime.wrap(function watchApiReponse$(_context4) {
        while (1) {
            switch (_context4.prev = _context4.next) {
                case 0:
                    if (!(response.status === 200)) {
                        _context4.next = 3;
                        break;
                    }

                    _context4.next = 3;
                    return (0, _effects.call)(responseOk);

                case 3:
                    if (!(response.status === 201)) {
                        _context4.next = 6;
                        break;
                    }

                    _context4.next = 6;
                    return (0, _effects.call)(responseOk);

                case 6:
                    if (!(response.status === 422)) {
                        _context4.next = 9;
                        break;
                    }

                    _context4.next = 9;
                    return _reactSAlert2.default.error(getFirstMessage(response.data.errors));

                case 9:
                    if (!([401, 400].indexOf(response.status) > -1)) {
                        _context4.next = 12;
                        break;
                    }

                    _context4.next = 12;
                    return (0, _effects.call)(responseNotOkay);

                case 12:

                    if (response.status === 401) {
                        _reactSAlert2.default.error(response.data.message);
                    }

                    if (!(response.status === 403 && response.data.message === "Token expired.")) {
                        _context4.next = 18;
                        break;
                    }

                    _context4.next = 16;
                    return (0, _effects.call)(_reactSAlert2.default.error, 'Session Expired');

                case 16:
                    _context4.next = 18;
                    return (0, _effects.put)({
                        type: "SIGN_OUT"
                    });

                case 18:
                    if (!(response.status === 500)) {
                        _context4.next = 21;
                        break;
                    }

                    _context4.next = 21;
                    return (0, _effects.call)(_reactSAlert2.default.error, 'Oops! Something went wrong. Please contact web admin');

                case 21:

                    if (response.status === 400 || response.status === 404) {
                        _reactSAlert2.default.error(response.data.message || getFirstMessage(response.data.errors));
                    }

                case 22:
                case 'end':
                    return _context4.stop();
            }
        }
    }, _marked2, this);
}

var isNumber = exports.isNumber = function isNumber(number) {
    if (_lodash2.default.isEmpty('' + number)) return true;
    var regexp = /^[0-9]+([,.][0-9]+)?$/g;
    return regexp.test(number);
};

var redirect = exports.redirect = function redirect(pathname) {
    var args = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _History2.default.push(pathname, args);
};

var toss = exports.toss = _reactSAlert2.default;
