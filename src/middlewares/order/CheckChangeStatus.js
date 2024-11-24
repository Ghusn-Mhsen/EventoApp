const CustomError = require('../../ErrorHandler/customError')
const statusCode = require('../../ErrorHandler/statusCode')
const validAdminStatus = ["processing", "shipped", "completed", "cancelled"];
const validManufacturerStatus = ["processing", "shipped"];
const validCustomerStatus = ["cancelled"];
const ROLES = {
    ADMIN: 'admin',
    USER: 'user',
    MANUFACTURER: 'manufacturer',
    SUPER_ADMIN: 'superAdmin'
};

function checkStatus(req, res, next) {
    try {
        const { status } = req.body;
        const path = req.path;
        const role = req.role;

        if (!status) {
            throw new CustomError('Status is required in the request body', statusCode.BadRequest)
        }

        if (!checkAccess(role, path, status)) {
            throw new CustomError('Unauthorized for this role and status combination', statusCode.Unauthorized)
        }
        next();
    } catch (error) {
        next(error)
    }
}

function checkAccess(role, path, status) {
    const isAdmin = role === ROLES.ADMIN;
    const isSUPER_ADMIN = role === ROLES.SUPER_ADMIN;
    const isUser = role === ROLES.USER;
    const isManufacturer = role === ROLES.MANUFACTURER;

    const isAdminAuthorized = (isAdmin || isSUPER_ADMIN) && validAdminStatus.includes(status);
    const isUserAuthorized = isUser && path.includes('/customer') && validCustomerStatus.includes(status);
    const isManufacturerAuthorized = isManufacturer && path.includes('/manufacturer/') && validManufacturerStatus.includes(status);

    return isAdminAuthorized || isUserAuthorized || isManufacturerAuthorized;
}

module.exports = checkStatus;
