const firebase = require("firebase-admin");
const db = require('../db');
const UserLogins = db.UserLogins;
const serviceAccount = require('../firebase/secret.json');

module.exports = {

    sendPushNotificationToSingleUser(notificationData) {

        return new Promise(async (resolve, reject) => {
            try {

                let userData = await UserLogins.findOne({ _id: notificationData.user_id }).lean().exec();
                let firebaseToken = userData.firebase_fcm_token;

                if(['',  undefined, null].includes(firebaseToken)) {
                    return resolve(false);
                }

                firebase.initializeApp({
                    credential: firebase.credential.cert(serviceAccount),
                });

                const payload = {
                    notification: {
                        title: '',
                        body: notificationData.message,
                    }
                };
                const options = {
                    priority: 'high',
                    timeToLive: 60 * 60 * 24, // 1 day
                };
                
                // firebaseToken = "_gXV_Q:APA91bEilYV29wz_TtCJwpOxDLDWfH3zZdAllP5yZcZCZyvwEn28X6OWj3U9hunav5yCBtpeXQWo9tbkIuWx7sS2kj0F0"
                // firebaseToken = "d2bGzOltROWxTr-BHN75rU:APA91bFp-l6btnOdcwno6VVNsfsZgsSsAUBg-Pe-bdJ-MTeJ6U7a7f53T5Q-JD-5a_H05R86MaiTAvPDhH5mkXUfNxll0P2jIYrf2Sk_1rLI4MihJx9gvOEsceg88z9ygLDLiAIyJlk5"

                console.log('firebaseToken is')
                console.log(firebaseToken)

                firebase.messaging().sendToDevice(firebaseToken, payload, options)

                data = { message: "successfully send message" }
                return resolve(data);
            } catch (error) {
                console.log("error", error);
                return resolve(false);
            }
        });
    },


}
