export class ServerError extends Error{
    statusCode;
    errors;

    constructor(message = 'Internal Server Error', statusCode = 500){
        super(message);
        this.name = `Server Error (${statusCode})`
        this.statusCode = statusCode
        this.errors = []
    }

    add(error) {
        this.errors.append(error);
        return this;
    }
}

export const badRequest = (message = "Bad Request") => new ServerError(message, 400);

export const unauthorized = (message = "Unauthorized") => new ServerError(message, 401);

export const forbidden = (message = "Forbidden") => new ServerError(message, 403);    

export const notFound = (message = "Not Found") => {
    const id = parseInt(message.id || message);
    if (isNaN(id)) return new ServerError(message, 404);
    return new ServerError(`Not found: ${id}`, 404);
}

export function toJSON(err) {
    const type = `${err.statusCode || err.errorCode || err.status || err.code || "Unknown"}`;
    let statusCode = parseInt(type);
    if (isNaN(statusCode) || statusCode < 400 || statusCode > 599) statusCode = 500;
    const message = err.message;
    const stack = err.stack;
    let json = {
        type,
        statusCode,
        message,
        stack
    };
    if (err.errors) json.errors = err.errors;
    else if (err.cause) json.errors = [err.cause];
    return json;
}

export function errorHandler(err, req, res, next){
    const e = toJSON(err)

    if(process.env.NODE_ENV === 'prod'){
        if(e.statusCode === 500) e.message = 'Internal Server Error';
        delete e.errors
        delete e.stack
    }

    res.status(e.statusCode).json(e)
}