var nodemailer = require('nodemailer');


var transporterAdmin = nodemailer.createTransport({
    // service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,     // 587 or 25 or 2525
    secure: true,
    auth: {
        user: "sunildeveloper7@gmail.com",
        pass: "developer@1234",
    },
});

var transporterInfo = nodemailer.createTransport({
    // service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,     // 587 or 25 or 2525
    secure: true,
    auth: {
        user: "sunildeveloper7@gmail.com",
        pass: "developer@1234",
    },
});

const Helper = {

    sendEmail(email, subject, msg_body) {
        // email sending
        var mailOptions = {
            from: 'sunildeveloper7@gmail.com',
            to: email,
            subject: subject,
            html: msg_body
        };
        transporterAdmin.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    },


  


    distanceCalculate(lat1, lat2, lon1, lon2) {

        // The math module contains a function
        // named toRadians which converts from
        // degrees to radians.
        lon1 = lon1 * Math.PI / 180;
        lon2 = lon2 * Math.PI / 180;
        lat1 = lat1 * Math.PI / 180;
        lat2 = lat2 * Math.PI / 180;

        // Haversine formula
        let dlon = lon2 - lon1;
        let dlat = lat2 - lat1;
        let a = Math.pow(Math.sin(dlat / 2), 2)
            + Math.cos(lat1) * Math.cos(lat2)
            * Math.pow(Math.sin(dlon / 2), 2);

        let c = 2 * Math.asin(Math.sqrt(a));

        // Radius of earth in kilometers. Use 3956
        // for miles
        let r = 6371;

        // calculate the result
        return (c * r);
    },


}

module.exports = Helper;