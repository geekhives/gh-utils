import axios from "axios";
import _ from "lodash";

const getToken = () => {
    const token = sessionStorage.getItem("token");
    return !_.isNil(token) ? token : false;
};

const transform = object => {
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

const instance = axios.create({
    timeout: 30000,
    baseURL: process.env.REACT_APP_END_POINT,
    transformRequest: transform,
    transformResponse: (response) => {
        try {
            const newResponse = JSON.parse(response);
            if(newResponse.status === 403 && newResponse.message === "Token Expired") {
                sessionStorage.clear();
                alert('Session expired!');
                window.href="/signin";
            }
            return newResponse;
        } catch(error) {
            console.log(response)
            return {
                status: 500
            }
        }
    },
    validateStatus: (status) => {
        return status >= 200;
    }
});

export const post = uri => args => {
    const token = getToken();
    if(token) {
        instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    return instance
        .post(uri, args)
        .then(response => {
            return response;
        })
        .catch(error => {
            return error;
        });
};

export const put = uri => args => {
    const token = getToken();
    if(token) {
        instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    return instance
        .put(uri, args)
        .then(response => {
            return response;
        })
        .catch(error => {
            return error;
        });
};

export const get = uri => params => {
    const token = getToken();
    if(token) {
        instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    return instance
        .get(uri, {
            params
        })
        .then(response => {
            return response;
        })
        .catch(error => {
            return error;
        });
};


export const externalUrl = (url) => {
    return `${url}?token=${getToken()}`
}