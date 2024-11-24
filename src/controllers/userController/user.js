const bcrypt = require("bcryptjs");
const validator = require("validator");
const response = require("../../utils/response");
const generateOTP = require("../../utils/generateOtp");
const generateJwtToken = require("../../utils/generateJwtToken");
const sendEmail = require("../../utils/send_mail");
const userRepository = require("../../repositories/UserRepository/user");
const CustomError = require('../../ErrorHandler/customError')
const statusCode = require('../../ErrorHandler/statusCode')

class UserController {
    async register(req, res, next) {
        try {
            const {
                username,
                password,
                email,
                phone,
            } = req.body;
            const otp = generateOTP();

            const userExists = await userRepository.findByUserNameOrEmail(username, email);

            const queries = {
                username: username,
                email: email,
                password: password,
                phone: phone,
                otp_code: otp,
                otp_expiration: new Date(Date.now() + 10 * 60 * 1000),
                is_verified: false,
            };

            const subject = "Email Verification";
            const message = `Your OTP code is: ${otp}`;


            const respondEmail = await sendEmail(queries.email, subject, message);
            if (!respondEmail) {
                throw new CustomError(`Invalid email address: ${email}`, statusCode.BadRequest)
            }



            const result = await userRepository.register(queries);
            result.password = undefined;
            result.otp_code = undefined
            result.otp_expiration = undefined
            result.is_verified = undefined
           

            return response(res, 200, {
                message: "Account registered",
                result: result,
            });
        } catch (error) {
            next(error)

        }
    }

    async addAdminOrManufacturer(req, res, next) {
        try {
            const {
                username,
                password,
                email,
                phone,
                role
            } = req.body;

            const userExists = await userRepository.findByUserNameOrEmail(username, email);

            const queries = {
                username: username,
                email: email,
                password: password,
                phone: phone,
                role: role,
            };

            const result = await userRepository.register(queries);

            return response(res, 200, {
                message: "Account registered",
                result: result,
            });
        } catch (error) {
            next(error)
        }
    }
    async deleteUser(req, res, next) {
        try {
            const _id = req.params.id;


            const deletedCount = await userRepository.deleteUser(_id);


            return response(res, 200, {
                message: 'User deleted successfully',
            });

        } catch (error) {
            next(error)

        }
    }
    async ResendOTP(req, res, next) {
        try {
            const {
                email
            } = req.body;
            const otp = generateOTP();

            const queries = {
                email: email,
                otp_code: otp,
                otp_expiration: new Date(Date.now() + 10 * 60 * 1000),
            };

            const subject = "Email Verification";
            const message = `Your OTP code is: ${otp}`;
            const emailExists = await userRepository.EmailExists(queries);
    
            const respondEmail = await sendEmail(queries.email, subject, message);
            if (!respondEmail) {
                throw new CustomError(`Invalid email address: ${email}`, statusCode.BadRequest)
            }


            const result = await userRepository.resendOTP(queries);

            return response(res, 200, {
                message: "OTP is resent",
                result: result,
            });
        } catch (error) {

            next(error)

        }
    }

    async VerifyEmail(req, res, next) {
        try {
            const {
                email,
                otp_code
            } = req.body;
            const emailExists = await userRepository.EmailExists({
                email,
            });

            const user = await userRepository.VerifyEmail({
                email,
                otp_code,
            });


            const token = generateJwtToken(user, user.role);

            const result = {
                user,
                token
            };

            return response(res, 200, {
                message: "Email is verified",
                result: result,
            });

        } catch (err) {
            return response(res, 500, err.message);
        }
    }
    async login(req, res, next) {
        try {
            const {
                email,
                password
            } = req.body;


            const query = {
                email
            };
            const user = await userRepository.findUser(query);
            var checkUserVerified = user.role === 'user' ? user.is_verified : true

            if (!user || !checkUserVerified) {
                throw new CustomError("This User is Not Registered !!", statusCode.BadRequest)
            }
            if (!(await bcrypt.compare(password, user.password))) {
                throw new CustomError("Your Password is Not Correct!!", statusCode.BadRequest)
            }
            const token = generateJwtToken(user, user.role);
            user.password = undefined;
            user.otp_code = undefined
            user.otp_expiration = undefined
            user.is_verified = undefined
            const result = {
                user,
                token
            };

            return response(res, 200, {
                message: "User Log In Success.",
                result: result,
            });
        } catch (error) {
            next(error)
        }
    }
    async ChangePassword(req, res, next) {
        try {
            const {
                email,
                password,
                otp_code
            } = req.body;

            const user = await userRepository.VerifyEmail({ email, otp_code });
            const result = await userRepository.changePassword(email, password);

            return response(res, 200, {
                message: "Changing Password Successfully",
                result: result,
            });
        } catch (error) {

            next(error)
        }
    }


    async logout(req, res, next) {
        try {

            const token = req.bearerToken;
            await userRepository.logout(token);

            return response(res, 200, {
                message: "logout Successfully",
            });
        } catch (error) {
            nexr(error)
        }
    }



    async getUserByID(req, res, next) {
        try {
            const id = req._id;

            const user = await userRepository.getUserByID(id);

            return response(res, 200, {
                message: "getProfile Successful",
                result: user
            });
        } catch (error) {
            next(error)
        }
    }


    async updateUser(req, res, next) {
        try {

            const {
                username,
                phone,
            } = req.body;
            const id = req._id;
            const user = await userRepository.updateUser(
                id,
                username,
                phone
            );


            response(res, 200, {
                message: "Update User Profile Successful",
                result: user
            })
        } catch (error) {
            next(error)
        }
    }
    async getAllUser(req, res, next) {
        try {
            let limit = 10;
            let offset = 0 + (req.query.page - 1) * limit;
            const Query = {
                role: "user"
            }
            const Users = await userRepository.getAllUser(offset, Query);
            return response(res, 200, {
                message: "Get All Users Successfully",
                result: Users
            })

        } catch (error) {
            next(error)
        }
    }
    async getAllAdmin(req, res, next) {
        try {
            let limit = 10;
            let offset = 0 + (req.query.page - 1) * limit;
            const Query = {
                role: "admin"
            }
            const Users = await userRepository.getAllUser(offset, Query);
            const result = Users
            return response(res, 200, {
                message: "Get All Admin Successfully",
                result: Users
            })

        } catch (error) {
            next(error)
        }
    }
    async getAllManufacturer(req, res, next) {
        try {
            let limit = 10;
            let offset = 0 + (req.query.page - 1) * limit;
            const Query = {
                role: "manufacturer"
            }
            const Users = await userRepository.getAllUser(offset, Query);
            const result = Users
            return response(res, 200, {
                message: "Get All Manufacturer Successfully",
                result: Users
            })

        } catch (error) {
            next(error)
        }
    }
}

module.exports = new UserController();