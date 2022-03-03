const { Notification } = require("../_helper/db");

module.exports = {
  list: async (req, res, next) => {
    try {

      let user_id = req.body.user_id;
      let notifications = await Notification.find({user_id: user_id }).lean().exec();
      res.status(200).send({ messsage: "notification get successfully",  data: notifications.reverse() });
    } catch (e) {
      res.status(400).send({ messsage: e });
    }
  },
};
