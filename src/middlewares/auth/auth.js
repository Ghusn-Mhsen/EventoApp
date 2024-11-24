const jwt = require('jsonwebtoken');
const UserRepository = require('../../repositories/UserRepository/user');
const CustomError = require('../../ErrorHandler/customError')
const statusCode = require('../../ErrorHandler/statusCode')
require("dotenv").config();


const ROLES = {
    ADMIN: 'admin',
    USER: 'user',
    MANUFACTURER: 'manufacturer',
    SUPER_ADMIN: 'superAdmin'
};

function checkAccess(role, path) {
    return (
        (role === ROLES.SUPER_ADMIN && path.includes('/superAdmin/')) ||
        (role === ROLES.ADMIN && path.includes('/admin/') || role === ROLES.SUPER_ADMIN) ||
        ((role === ROLES.USER || role === ROLES.ADMIN || role === ROLES.SUPER_ADMIN) && path.includes('/customer')) ||
        (role === ROLES.MANUFACTURER && path.includes('/manufacturer/')) ||
        (path.includes('/user/'))
    );
}


module.exports = async (req, res, next) => {

    try {
        const authHeader = req.headers.authorization;

        if (!authHeader)
            throw new CustomError("'No token provided'", statusCode.Unauthorized)

        const arrayAuth = authHeader.split(' ');
        if (arrayAuth.length != 2 || arrayAuth[0] != 'Bearer')
            throw new CustomError("The provided token is invalid", statusCode.Unauthorized)


        const token = arrayAuth[1];
        req.bearerToken = token;
        const blocked = await UserRepository.findByToken(token)
        jwt.verify(token, process.env.SECRET, (err, decoded) => {


            if (err) {
                let error;
                switch (err.name) {
                    case 'TokenExpiredError':
                        error = 'Expired token';
                        break;
                    default:
                        error = 'Invalid token';
                        break;
                }
                throw new CustomError(error, statusCode.BadRequest)
            }


            if (!(checkAccess(decoded.role, req.path))) {
                throw new CustomError("Non Authorized ..", statusCode.Unauthorized)
            }

            req.bearerToken = token;
            req.tokenInfo = decoded;
            req._id = decoded._id;
            req.role = decoded.role
            next();
        });
    } catch (error) {
        next(error)
    }


}