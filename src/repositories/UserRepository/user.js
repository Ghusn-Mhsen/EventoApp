const User = require('../../models/User/userModel.js');
const ObjectId = require('mongoose').Types.ObjectId;
const BlackList = require('../../models/User/blackListSchema.js');
const mongoose = require("mongoose")
const CustomError = require('../../ErrorHandler/customError')
const statusCode = require('../../ErrorHandler/statusCode')

class UserRepository {
    async register(user) {
        try {
            const userDoc = await User.create(user);
            return userDoc
        } catch (error) {
            throw new CustomError(error.message, error.statusCode)
        }
    }
    async deleteUser(_id) {
        const validProductId = new mongoose.Types.ObjectId(_id);
        try {
            const { deletedCount } = await User.deleteOne({
                _id: validProductId
            });
        
            if (!deletedCount || deletedCount <= 0) {
                throw new CustomError("User Not Found", statusCode.NotFound)
            }
            return deletedCount;

        } catch (error) {
            throw new CustomError(error.message, error.statusCode)
        }
    }
    async resendOTP({
        email,
        otp_code,
        otp_expiration
    }) {
        try {
            const result = await User.findOneAndUpdate({
                email: email
            }, {
                $set: {
                    otp_code: otp_code,
                    otp_expiration: otp_expiration,
                    is_verified: false
                },
            }, {
                new: true,
            });

            if (!result)
                throw new CustomError("User With This Email Not Found", statusCode.NotFound)


            return result;

        } catch (error) {
            throw new CustomError(error.message, error.statusCode)
        }
    }
    async EmailExists({
        email
    }) {

        try {
            const EmailExists = await User.find({ email })
            if (!EmailExists)
                throw new CustomError(" Email Not Found", statusCode.NotFound)
            return EmailExists

        } catch (error) {
            throw new CustomError(error.message, error.statusCode)
        }
    }
    async VerifyEmail({
        email,
        otp_code
    }) {

        try {
            const user = await User.findOne({
                email: email,
                otp_code: otp_code
            });
            if (!user) {
                throw new CustomError('OTP is invalid', statusCode.BadRequest)
            }

            const OTPExpired = new Date() > new Date(user.otp_expiration)

            if (OTPExpired) {
                throw new CustomError('OTP is expired', statusCode.BadRequest)
            }

            const alreadyVerified = user.is_verified === true
            if (alreadyVerified) {
                throw new CustomError('Email has been verified', statusCode.BadRequest)
            }

            const updatedData = await User.findOneAndUpdate({
                email: email
            }, {
                $set: {
                    is_verified: true,
                },
            }, {
                new: true,
            });
            if (!updatedData) {
                throw new CustomError('User Not Found', statusCode.NotFound)
            }

            return updatedData
        } catch (error) {
            throw new CustomError(error.message, error.statusCode)
        }
    }
    async changePassword(email, newPassword) {
        try {
            const user = await User.findOne({
                email: email
            });

            if (!user) {
                throw new CustomError('User Not Found', statusCode.NotFound)
            }

            user.password = newPassword;

            const updatedUser = await user.save();
            return updatedUser;
        } catch (error) {
            console.error('Error changing password:', error.message);
            throw new CustomError(error.message, error.statusCode)
        }
    }
    async logout(token) {
        try {
          return await BlackList.create({
                token
            });
         

        } catch (error) {
            throw new CustomError(error.message, error.statusCode)
        }
    }
    async findUser(query) {
        try {
            const user = await User.findOne(query).select({
                "password": 1,
                "role": 1,
                "username": 1,
                "email": 1,
                "phone": 1,
                "is_verified": 1
            })
            if (!user) {
                throw new CustomError('User Not Found', statusCode.NotFound)
            }
            return user;
        } catch (error) {
            throw new CustomError(error.message, error.statusCode)
        }
    }
    async findByToken(token) {
        try {
            const user = await BlackList.findOne({
                token
            });
            if (user) {
                throw new CustomError("The provided token is invalid", statusCode.Unauthorized)
            }
            return user;
        } catch (error) {
            throw new CustomError(error.message, error.statusCode)
        }
    }
    async findByUserNameOrEmail(username, email) {
        try {
            const userExists = await User.findOne({
                $or: [{
                    username: username
                },
                {
                    email: email
                }
                ]
            }).select({
                password: 0,
                otp_code: 0,
                otp_expiration: 0,
                is_verified: 0
            });
            
            if (userExists) {
                throw new CustomError("This User Is Already Signed.", statusCode.BadRequest)
            }
            return userExists;
        } catch (error) {
            throw new CustomError(error.message, error.statusCode)
        }
    }
    async findByUserName(name) {
        try {
            const user = await User.findOne({
                username: name
            }).select({
                password: 0
            })
            if (!user) {
                throw new CustomError('User Not Found', statusCode.NotFound)
            }
            return user;
        } catch (error) {
            throw new CustomError(error.message, error.statusCode)
        }
    }
    async findByUserEmail(email) {
        try {
            const user = await User.findOne({
                email: email
            }).select({
                password: 0,
                otp_code: 0,
                otp_expiration: 0,
                is_verified: 0
            })
            if (!user) {
                throw new CustomError('User Not Found', statusCode.NotFound)
            }
            return user;
        } catch (error) {
            throw new CustomError(error.message, error.statusCode)
        }
    }
    async getUserByID(id) {
        try {
            const user = await User.findOne({
                _id: id
            }).select({
                password: 0,
                otp_code: 0,
                otp_expiration: 0,
                is_verified: 0
            });
            if (!user) {
                throw new CustomError('User Not Found', statusCode.NotFound)
            }
            return user;
        } catch (error) {
            throw new CustomError(error.message, error.statusCode)
        }

    }
    async updateUser(id, username, phone) {
        try {
            const user = await User.findOneAndUpdate({
                "_id": id
            }, {
                "$set": {
                    "username": username,
                    "phone": phone
                }
            }, {
                new: true
            });
            if (!user) {
                throw new CustomError('User Not Found', statusCode.NotFound)
            }
            return user;
        } catch (error) {
            throw new CustomError(error.message, error.statusCode)
        }

    }
    async getAllUser(offset, Query) {
        try {
            const users = await User.find(Query).skip(offset).limit(10);
            return users || []
        } catch (error) {
            throw new CustomError(error.message, error.statusCode)
        }
    }
}

module.exports = new UserRepository();