const mongoose = require('mongoose');
const Influencer = require('../../models/influencer/influencer');
const CustomError = require('../../ErrorHandler/customError')
const statusCode = require('../../ErrorHandler/statusCode')

class InfluencerRepository {
    async addInfluencer(influencerData) {
        try {
            const newInfluencer = new Influencer(influencerData);
            const savedInfluencer = await newInfluencer.save();
            return savedInfluencer;
        } catch (error) {
            throw new CustomError(error.message ,error.statusCode);
        }
    }

    async deleteInfluencerById(_id) {
        try {
            const validInfluencer = new mongoose.Types.ObjectId(_id);
            const deletedInfluencer = await Influencer.findByIdAndDelete(validInfluencer);
            if (!deletedInfluencer) {
                throw new CustomError('Influencer not found.',statusCode.NotFound);
            }
            return deletedInfluencer;
        } catch (error) {
            throw new CustomError(error.message ,error.statusCode);
        }
    }

    async updateInfluencer(_id, updatedData) {
        try {
            const validInfluencer = new mongoose.Types.ObjectId(_id);
            const newInfluencer = await Influencer.findById(validInfluencer);

            if (!newInfluencer) {
                throw new CustomError('Influencer not found.',statusCode.NotFound);
            }

            newInfluencer.name = updatedData.name;
            newInfluencer.email = updatedData.email;
            newInfluencer.phoneNumber = updatedData.phoneNumber;
            newInfluencer.region = updatedData.region;
    
            return await newInfluencer.save();
        } catch (error) {
            throw new CustomError(error.message ,error.statusCode);
        }
    }
    

    async getInfluencerById(_id) {
        try {
            const validInfluencer = new mongoose.Types.ObjectId(_id);
            const influencer = await Influencer.findById({_id:validInfluencer});
            if (!influencer) {
                throw new CustomError('Influencer not found.',statusCode.NotFound);
            }
            return influencer;
        } catch (error) {
            throw new CustomError(error.message ,error.statusCode);
        }
    }

    async getAllInfluencesSortedByRating() {
        try {
            const influences = await Influencer.aggregate([
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        email: 1,
                        phoneNumber: 1,
                        region: 1,
                        rating: 1,
                        averageRating: { $avg: '$rating.rating' },
                    },
                },
                { $sort: { averageRating: -1 } },
            ]);
    
            return influences || [];
        } catch (error) {
            throw new CustomError(error.message ,error.statusCode);
        }
    }
    

    async addRating(influencerId, Data) {
        try {
            const {modifiedCount} = await Influencer.updateOne({
                _id: influencerId
            }, {
                $push: {
                    rating: Data
                }
            });
            if (!modifiedCount || modifiedCount <= 0) {
                throw new CustomError("Influencer not found", statusCode.NotFound)
            }
            return modifiedCount;
        } catch (error) {
            throw new CustomError(error.message ,error.statusCode);
        }
    }
}

module.exports = new InfluencerRepository();