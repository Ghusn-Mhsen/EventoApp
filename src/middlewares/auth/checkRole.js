const CustomError = require('../../ErrorHandler/customError')
const statusCode = require('../../ErrorHandler/statusCode')

const ROLES = {
    ADMIN: 'admin',
    MANUFACTURER: 'manufacturer',
};

function checkRole(req, res, next) {
    try {
        const {
            role
        } = req.body;


        const isAdmin = role === ROLES.ADMIN;
        const isManufacturer = role === ROLES.MANUFACTURER;

        if (!role) {
            throw new CustomError("role is required in the request body", statusCode.BadRequest)
        }
        if (!isAdmin && !isManufacturer) {
            throw new CustomError("can not add this role", statusCode.BadRequest)
        }
        next()
    } catch (error) {
        next(error)
    }
}


module.exports = checkRole;