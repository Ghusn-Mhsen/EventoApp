const Notification = require('../../models/Notification/notification');
const CustomError = require('../../ErrorHandler/customError')
const statusCode = require('../../ErrorHandler/statusCode')

class NotificationRepository {
    async addNotification(notificationData) {
        try {
            return await Notification.create(notificationData);
        } catch (error) {
            throw new CustomError(error.message, error.statusCode);
        }
    }

    async getAllNotifications(offset) {
        try {
            const notification = await Notification.find({}).skip(offset).limit(10);
            return notification || [];
        } catch (error) {
            throw new CustomError(error.message, error.statusCode);
        }
    }

    async deleteNotificationById(notificationId) {
        try {
            const notification = await Notification.findByIdAndDelete(notificationId);
            if (!notification) {
                throw new CustomError('notification not found', statusCode.NotFound);
            }
            return notification;
        } catch (error) {
            throw new CustomError(error.message, error.statusCode);
        }
    }
}

module.exports = new NotificationRepository();

