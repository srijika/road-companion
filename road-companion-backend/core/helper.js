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

        let km = c * r;

        let miles = km / 1.6;

        // calculate the result
        // return  parseInt(km) + " KM";
        return  parseInt(miles) + " Miles";
    },




    getReviewRatingCalculate(reviews) {


        let reviewObj = {
            fiveStar: 0,
            fourStar: 0,
            threeStar: 0,
            twoStar: 0,
            oneStar: 0,
        };

        let five = 1;
        let four = 1;
        let three = 1;
        let two = 1;
        let one = 1;
        reviews.map((item) => {
            if (item.rating == 5) {
                reviewObj.fiveStar = five++;
            } else if (item.rating == 4) {
                reviewObj.fourStar = four++;
            } else if (item.rating == 3) {
                reviewObj.threeStar = three++;
            } else if (item.rating == 2) {
                reviewObj.twoStar = two++;
            } else if (item.rating == 1) {
                reviewObj.oneStar = one++;
            }

        })

        let totalRating = ((5*reviewObj.fiveStar) + (4 * reviewObj.fourStar)+ (3 * reviewObj.threeStar) + (2 * reviewObj.twoStar) + (1 * reviewObj.oneStar))
        //let totalNumberOfReviews = parseInt(reviewObj?.fiveStar) + parseInt(reviewObj?.fourStar) + parseInt(reviewObj?.threeStar) + parseInt(reviewObj?.twoStar) + parseInt(reviewObj?.oneStar);
        let totalNumberOfReviews = 0;
        if(reviewObj && reviewObj.fiveStar) {
            totalNumberOfReviews = totalNumberOfReviews + parseInt(reviewObj.fiveStar)
        }

        if(reviewObj && reviewObj.fourStar) {
            totalNumberOfReviews = totalNumberOfReviews + parseInt(reviewObj.fourStar)
        }

        if(reviewObj && reviewObj.threeStar) {
            totalNumberOfReviews = totalNumberOfReviews + parseInt(reviewObj.threeStar)
        }

        if(reviewObj && reviewObj.twoStar) {
            totalNumberOfReviews = totalNumberOfReviews + parseInt(reviewObj.twoStar)
        }

        if(reviewObj && reviewObj.oneStar) {
            totalNumberOfReviews = totalNumberOfReviews + parseInt(reviewObj.oneStar)
        }

        let result = totalRating / totalNumberOfReviews;
        // console.log('totalNumberOfReviews')
        // console.log(totalRating)
        // console.log(totalNumberOfReviews)
        // console.log(result)

        return result;

    }

}

module.exports = Helper;