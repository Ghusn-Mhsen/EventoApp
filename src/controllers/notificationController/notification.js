const NotificationRepository = require('../../repositories/NotificationRepositories/notification');
const response = require('../../utils/response');

class NotificationController {
    async addNotification(req,res,next) {
        try {
            const {
                title,
                subTitle
            } = req.body;

          

            const NotificationData = {
                title,
                subTitle
            };

            const result = await NotificationRepository.addNotification(NotificationData);

            return response(res, 200, {
                message: 'Notification added successfully',
                result
            });
        } catch (error) {
           next(error)
        }
    }

    async getAllNotifications(req,res,next) {
        try {

            let limit = 10;
            let page = parseInt(req.query.page) || 1;
            let offset = (page - 1) * limit;

            const result = await NotificationRepository.getAllNotifications(offset);
            return response(res, 200, {
                message: 'Notification retrieved successfully',
                result
            });
        } catch (error) {
            next(error)
         }
    }

    async deleteNotification(req,res,next) {
        try {
            const notificationId = req.params.id;
            const result = await NotificationRepository.deleteNotificationById(notificationId);
            
            return response(res, 200, {
                message: 'Notification deleted successfully',
                data: result
            });
        } catch (error) {
            next(error)
         }
    }
}

module.exports = new NotificationController();