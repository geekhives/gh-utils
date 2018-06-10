import { call, put } from 'redux-saga/effects'
import alert from 'react-s-alert';
import History from './History';
import _ from 'lodash';

export const amountFormat = amount => {
    if (!amount) return 0;
    return amount.replace(/./g, function(c, i, a) {
        return i && c !== "." && (a.length - i) % 3 === 0 ? "," + c : c;
    });
};

export const sessionStoreSetItem = (key, object) => {
    try {
        const items = sessionStorage.getItem(key);
        if (items === null) {
            return sessionStorage.setItem(key, JSON.stringify(object));
        }
        const objects = JSON.parse(sessionStorage.getItem(key));
        const newObjects = Object.assign({}, object, objects);
        sessionStorage.setItem(key, JSON.stringify(newObjects));
    } catch (error) {
        console.log(error);
    }
};

export const sessionStorageGetItem = key => {
    try {
        return JSON.parse(sessionStorage.getItem(key)) || {};
    } catch (error) {
        return {};
    }
};

export const secToTime = duration => {
    //let milliseconds = parseInt((duration%1000)/100, 10)
    let seconds = parseInt(duration % 60, 10);
    let minutes = parseInt(duration / 60 % 60, 10);
    let hours = parseInt(duration / (60 * 60) % 24, 10);

    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds;
};

export const loadAPI = (id, src, cb) => {
    var js, fjs = document.getElementsByTagName("script")[0];
    if (document.getElementById(id)) return;
    js = document.createElement("script");
    js.id = id;
    js.src = src;
    js.onload = cb;
    fjs.parentNode.insertBefore(js, fjs);
};

export const transform = object => {
    let arr = [];
    for (let p in object) {
        if (object.hasOwnProperty(p) && !Array.isArray(object[p])) {
            arr.push(
                encodeURIComponent(p) + "=" + encodeURIComponent(object[p])
            );
        }

        if (Array.isArray(object[p])) {
            object[p].forEach((item, key) => {
                arr.push(
                    encodeURIComponent(`${p}[${key}]`) +
                        "=" +
                        encodeURIComponent(item)
                );
            });
        }
    }
    return arr.join("&");
};

export const getFirstMessage = data => {
    let firstMessage = "";
    let x = 0;

    Object.keys(data).map(i => {
        if (x === 0) {
            firstMessage = data[i];
        }
        return x++;
    });
    return firstMessage;
};


export function* api({ api, args = {}, loading }) {
    yield put({ type: "IS_LOADING", loadingType: loading });
    const response = yield call(api, args);
    yield put({ type: "IS_LOADING", loadingType: null });

    return response;
}

export function* watchApiReponse(response = {}, responseOk = function* (){}, responseNotOkay = function* (){}) {

    if(response.status === 200){
        yield call(responseOk);
    }

    if(response.status === 201){
        yield call(responseOk);
    }

    if(response.status === 422){
        yield alert.error(getFirstMessage(response.data.errors));
    }

    if([401,400].indexOf(response.status) > -1) {
        yield call(responseNotOkay)
    }

    if(response.status === 401){
        alert.error(response.data.message);
    }

    if(response.status === 403 && response.data.message === "Token expired.") {
        yield call(alert.error,'Session Expired');
        yield put({
            type: "SIGN_OUT"
        })
    }

    if(response.status === 500) {
        yield call(alert.error, 'Oops! Something went wrong. Please contact web admin')
    }

    if(response.status === 400 || response.status === 404){
        alert.error(response.data.message || getFirstMessage(response.data.errors));
    }
}

export const isNumber = (number) => {
    if(_.isEmpty(`${number}`)) return true;
    const regexp = /^[0-9]+([,.][0-9]+)?$/g;
    return regexp.test(number);
}

export const redirect = (pathname, args = {}) => {
    History.push(pathname, args);
}

export const toss = alert;