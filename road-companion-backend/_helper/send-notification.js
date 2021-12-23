const Notification = require("../models/notifications.js");

module.exports = async function (for_notification, loginid, notification_type, message) {
 let NotificationSave;
    if(loginid != undefined && loginid != "" &&  loginid != null) {


     NotificationSave = new Notification({
         for_notification: for_notification,  
         loginid: loginid, 
         notification_type: notification_type,  
         message: message,  
    });

    }else {

     NotificationSave = new Notification({
         for_notification: for_notification,  
         notification_type: notification_type,  
         message: message,  
    });


    }

  await NotificationSave.save();

};
