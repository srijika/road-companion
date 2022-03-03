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
                
                console.log('firebaseToken', firebaseToken)
                firebase.messaging().sendToDevice(firebaseToken, payload, options)
                console.log('message send')

                data = { message: "successfully send message" }
                return resolve(data);
            } catch (error) {
                console.log("error", error);
                return resolve(false);
            }
        });
    },


}
