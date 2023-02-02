import chalk from "chalk"
import { toJSON } from "./errors.mjs"
import pjson from 'pjson'

function formatDate(timestamp) {
    return timestamp.toLocaleString();
}

function shortMsg({origin = pjson.name, level, description, err = null, 
    timestamp, logger, ...content}) {
        const src = origin ? `[${origin}] ` : ``;
        let msg = `[${formatDate(timestamp)}] ${src}${level}: ${description} ${JSON.stringify(content)}`;
        if (err) {
            if (err.stack) msg += `\n${err.stack}`;
            if (err.errors) msg += `\nErrors: ${JSON.stringify(err.errors, null, 4)}`;
            if (!err.stack && !err.errors) msg += `\n${JSON.stringify(err, null, 4)}`;            
        }
        return msg;
}

function register(params) {
    params.timestamp = new Date();
    const {logger, level} = params;

    let color;
    if (level === 'ERROR') color = chalk.redBright;
    else if (level === 'INFO') color = chalk.yellowBright;
    else color = chalk.white;

    console.error(color(shortMsg(params)));

    if (logger) logger(longMsg(params));
    return false;
}

export const debug = (params) => register( {level: 'DEBUG', ...params});
export const info = (params) => register( {level: 'INFO', ...params});
export const error = (params) => register( {level: 'ERROR', ...params});

export async function logHandler(err, req, res, next){
    const errorObj = toJSON(err);
    const description = `${req.method} ${req.url} "Error: ${err.statusCode}: ${err.message || ""}`;

    const log = {
        description, 
        err,
        env: process.env.NODE_ENV,
        agent: req.headers['user-agent'],
        method: req.method,
        path: req.path,
        params: Object.keys(req.params).length === 0 ? undefined : req.params,
        query: Object.keys(req.query).length === 0 ? undefined : req.query,
        body: Object.keys(req.body).length === 0 ? undefined : req.body,
        user: req.user
    }
    errorObj.statusCode === 500 ? error(log) : info(log);

    if (next) next(err);
}

export function runAndLog(promise, {origin='Async', onSuccess = info, onError = error} = {}) {
    return promise.then(r => {
            const log = {origin, description: 'Success'};
            if (r) log.result = JSON.stringify(r);
            onSuccess(log);
        }).catch(err => onError({origin, description: 'Failure', err}))
}