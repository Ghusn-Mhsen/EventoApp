const Social = require('../../models/Social/social');
const mongoose = require('mongoose');
const CustomError = require('../../ErrorHandler/customError')
const statusCode = require('../../ErrorHandler/statusCode')

class SocialRepository {

    async addSocial(social) {
        try {
            const newSocial = await Social.create(social);

            return newSocial;
        } catch (error) {
            throw new CustomError(error.message, error.statusCode)
        }
    }

    async updateSocial(social) {
        try {
            const newSocial = await Social.findById(social._id);
            if (!newSocial) {
                throw new CustomError('Social not found ', statusCode.NotFound)
            }
            newSocial.socialName = social.socialName;
            newSocial.socialUrl = social.socialUrl;
            newSocial.socialIcon = social.socialIcon;

            return await newSocial.save();
        } catch (error) {
            throw new CustomError(error.message, error.statusCode)
        }

    }
    async getSocialByID(_id) {
        try {
            const validSocialId = new mongoose.Types.ObjectId(_id);
            return await Social.findOne({
                _id: validSocialId
            })
        } catch (error) {
            throw new CustomError(error.message, error.statusCode)
        }
    }

    async deleteSocial(_id) {
        try {
            const validSocialId = new mongoose.Types.ObjectId(_id);
            const deletedSocial = await Social.findOneAndDelete({
                _id: validSocialId
            });

            if (!deletedSocial) {
                throw new CustomError('Social not found', statusCode.NotFound);
            }

            return deletedSocial;
        } catch (error) {
            throw new CustomError(error.message, error.statusCode)
        }
    }

    async getAllSocial() {
        try {
            const social = await Social.find();
            return social || [];
        } catch (error) {
            throw new CustomError(error.message, error.statusCode)
        }
    }
}



module.exports = new SocialRepository();