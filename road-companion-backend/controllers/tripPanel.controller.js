const { UserTrip, UserVehicle, Rider, Notification, StripePayment, Review, UserLogins, WithdrawRequest } = require('../_helper/db');
var path = require('path');
const aws = require('aws-sdk');

module.exports = {


    getTripsLists: async (req, res, next) => {

        console.log('api working')
        try {   
            
            let data = await UserTrip.find({}).select('driver_name from_destination to_destination color').populate('user_id', 'email').sort('-_id');
            return res.send({ status: 200, data: data });
        } catch (error) {
            return res.status(400).send({ status: 400, message: error.message });
        }
    }

}
