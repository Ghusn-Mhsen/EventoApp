const response = require('../utils/response')
const exceptionHandler = (error, req, res, _next) => {
    const statusCode = error.statusCode || 500;
    const defaultMessage = 'Internal Server Error';
    const message = error.message || defaultMessage;

    return response(res, statusCode, {
        message
    })
};

module.exports = {
    exceptionHandler,
};