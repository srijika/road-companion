const { Notification } = require("../_helper/db");

module.exports = {
  list: async (req, res, next) => {
    try {

      
      let { read_messages, user_id } = req.body;

      if (read_messages) {
        console.log('updated');
        await Notification.updateMany({ user_id: user_id }, {$set: { status: 1 } })
      }


      let notifications = await Notification.find({ user_id: user_id }).lean().exec();
      let unreadMessagesCount = await Notification.count({ user_id: user_id, status: 0 });
      

      res.status(200).send({ message: "notification get successfully",  data: notifications.reverse(), unreadMessagesCount });
    } catch (e) {
      console.log('errors', e);
      res.status(400).send({ message: e });
    }
  },


  readNotification: async (req, res, next) => {
    try {

      let {notification_id} = req.body;
      
      await Notification.updateOne({_id: notification_id }, {
        $set: {
          status: 1
        }
      });

      console.log('sttatus updated notification')

      res.status(200).send({ messsage: "notification status successfully"});
    } catch (e) {
      res.status(400).send({ messsage: e });
    }
  },

};
