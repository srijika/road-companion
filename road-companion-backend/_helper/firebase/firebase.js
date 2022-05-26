const firebase = require("firebase-admin");
const db = require('../db');
const UserLogins = db.UserLogins;
const serviceAccount = require('../firebase/secret.json');

module.exports = {

    sendPushNotificationToSingleUser(notificationData) {

        return new Promise(async (resolve, reject) => {
            try {

                let userData = await UserLogins.findOne({ _id: notificationData.user_id }).lean().exec();
                let firebaseToken = "d9VmoE9MUkIlh33eT1eFDJ:APA91bFsHuOwA7mVYaC6YIWLDue0G0cs891H-wjtYszbhTqICCj5HUmgaNffPiomP8rzwrwukn3Bn-h1NjKKK4p7eOXnpe-iWaxVwGOjNJxfu1Tq_P1uPHmpH_gr8srlZxlvJtfSB9mn"
                
                // let firebaseToken = userData.firebase_fcm_token;

                if (['', undefined, null].includes(firebaseToken)) {
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


                firebase.messaging().sendToDevice(firebaseToken, payload, options).then((response) => {

                    console.log('Successfully sent message:', response);
                    console.log('Successfully sent message:', response.results);
                    data = { message: "successfully send message" }
                    return resolve(data);
                })
                    .catch((error) => {
                        console.log('Error sending message:', error);

                        return resolve(false);
                    });



            } catch (error) {
                console.log("error", error);
                return resolve(false);
            }
        });
    },


}
