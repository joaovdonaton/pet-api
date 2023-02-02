import axios from "axios";

import {debug} from '../security/logging.mjs'

function formatRequest(r) {
    return `${r.method} ${r.url}`;        
}

function formatResponse(r) {
    return `data: ${JSON.stringify(r.data)}`;
}

export function newAxios(params) {
    const instance = axios.create(params);
    instance.interceptors.request.use(r => {
        debug({description: formatRequest(r)})
        return r;
    });
    instance.interceptors.response.use(r => {
        debug({description: formatResponse(r)})
        return r;
    });

    return instance;
}