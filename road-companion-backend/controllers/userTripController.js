const { UserTrip, UserVehicle, Rider, Notification, StripePayment, Review } = require('../_helper/db');
var path = require('path');
var fs = require('fs');
const mongoose = require('mongoose');
const aws = require('aws-sdk');
const S3image_url = 'https://choovoo-test.s3.ap-south-1.amazonaws.com/';
const Helper = require('../core/helper');
const moment = require('moment')
const firebase = require('../_helper/firebase/firebase')

aws.config.update({
    secretAccessKey: 'aoSbNdNF3K2+z31gGJX31RuKTNijkfPWwRxymHAV',
    accessKeyId: 'AKIAXRCHJ4CSM5C36R77',
    region: 'ap-south-1'
});
const s3Bucket = new aws.S3({ params: { Bucket: 'choovoo-test' } });
const Stripe = require("stripe")

const stripe = Stripe(process.env.STRIPE_SECRET_KEY)


module.exports = {


    //---------------- Functions for trips modules -------------//

    createTrip: async (req, res, next) => {

        // try {
        let license = '';

        console.log('req.body')
        console.log(req.body)

        const obj = {};
        if (req.files && req.files[0] && req.files[0].location) {
            license = req.files[0].location;
            obj.driving_license_image = license;
        }
        for (let [key, value] of Object.entries(req.body)) {
            obj[key] = value;
        }

        var to = JSON.parse("[" + req.body.from_location + "]");
        var from = JSON.parse("[" + req.body.to_location + "]");
        obj.from_location = { "type": "Point", "coordinates": to }
        obj.to_location = { "type": "Point", "coordinates": from }


        const Trip = new UserTrip(obj);
        await Trip.save();
        console.log('working');
        return res.status(200).send({ status: 200, message: 'Trip created successfully' });
        // } catch (error) {
        //     return res.status(400).send({ status: 400, message: error.message });
        // }

    },


    getTrips: async (req, res, next) => {
        try {

            let search = req.query.search;
            console.log('search', search)

            let user_id = req.body.user_id;



            let trips = await UserTrip.aggregate([
                { "$match": { user_id: mongoose.Types.ObjectId(user_id) }, },
                {
                    $match: {
                        $or: [
                            { from_destination: { $regex: search, $options: 'i' } },
                            { to_destination: { $regex: search, $options: 'i' } }
                        ]
                    }
                },
                {
                    $lookup:
                    {
                        from: 'user_vehicles',
                        localField: 'vehicle_id',
                        foreignField: '_id',
                        as: 'vehicleData'
                    }
                },
                {
                    $lookup:
                    {
                        from: 'riders',
                        localField: '_id',
                        foreignField: 'trip_id',
                        as: 'riderData'
                    }
                },
                {
                    $unwind: {
                        path: "$riderData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "riderData.user_id",
                        foreignField: "_id",
                        as: "riderData.userDetail",
                    }
                },
                {
                    $group: {
                        _id: "$_id",
                        travel_price: { $first: "$travel_price" },
                        luggage_price: { $first: "$luggage_price" },
                        driver_name: { $first: "$driver_name" },
                        trip_status: { $first: "$trip_status" },

                        from_location: { $first: "$from_location" },
                        to_location: { $first: "$to_location" },

                        from_destination: { $first: "$from_destination" },
                        to_destination: { $first: "$to_destination" },
                        date_of_departure: { $first: "$date_of_departure" },
                        time_of_departure: { $first: "$time_of_departure" },
                        is_smoking: { $first: "$is_smoking" },
                        user_id: { $first: "$user_id" },
                        vehicleData: { $first: "$vehicleData" },
                        riderData: { $push: "$riderData" }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        travel_price: 1,
                        luggage_price: 1,
                        driver_name: 1,
                        trip_status: 1,
                        from_location: 1,
                        to_location: 1,


                        from_destination: 1,
                        to_destination: 1,
                        date_of_departure: 1,
                        time_of_departure: 1,
                        is_smoking: 1,
                        user_id: 1,

                        "vehicleData._id": 1,
                        "vehicleData.images": 1,
                        "vehicleData.seat_available": 1,
                        "riderData._id": 1,
                        "riderData.status": 1,
                        "riderData.trip_type": 1,
                        "riderData.userDetail._id": 1,
                        "riderData.userDetail.avatar": 1,
                    }
                },

                { $sort: { '_id': -1 } },
            ]).exec();;





            // Add Distance to all trips with lat long
            trips.forEach((item) => {
                let from_location = item.from_location.coordinates;
                let to_location = item.to_location.coordinates;
                let from_lat = from_location[0]
                let from_lng = from_location[1]
                let to_lat = to_location[0]
                let to_lng = to_location[1]
                let distance = Helper.distanceCalculate(from_lat, to_lat, from_lng, to_lng)
                item['distance'] = parseInt(distance) + " KM";
            })

            // let trips = await UserTrip.find({ user_id: user_id }).populate('vehicle_id').lean().exec();


            let rides = await Rider.find({ user_id: user_id }).sort({ 'created_at': -1 }).populate('trip_id').lean().exec();
            rides.forEach((item) => {
                let from_location = item.trip_id.from_location.coordinates;
                let to_location = item.trip_id.to_location.coordinates;
                let from_lat = from_location[0]
                let from_lng = from_location[1]
                let to_lat = to_location[0]
                let to_lng = to_location[1]
                let distance = Helper.distanceCalculate(from_lat, to_lat, from_lng, to_lng)
                item.trip_id['distance'] = parseInt(distance) + " KM";
            })




            return res.status(200).send({ status: 400, data: trips, rides: rides, message: "trips get successfully" });
        } catch (e) {
            console.log(e);
            return res.status(400).send({ status: 400, message: e.message });
        }
    },



    tripDetail: async (req, res, next) => {
        try {

            let trip_id = req.body.trip_id;
            console.log(trip_id)

            let tripDetail = await UserTrip.aggregate([
                { "$match": { _id: mongoose.Types.ObjectId(trip_id) } },
                {
                    $lookup:
                    {
                        from: 'user_vehicles',
                        localField: 'vehicle_id',
                        foreignField: '_id',
                        as: 'vehicleData'
                    }
                },
                {
                    $lookup:
                    {
                        from: 'riders',
                        localField: '_id',
                        foreignField: 'trip_id',
                        as: 'riderData'
                    }
                },
                {
                    $unwind: {
                        path: "$riderData",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "riderData.user_id",
                        foreignField: "_id",
                        as: "riderData.userDetail",
                    }
                },
                {
                    $group: {
                        _id: "$_id",
                        user_id: { $first: "$user_id" },
                        travel_price: { $first: "$travel_price" },
                        luggage_price: { $first: "$luggage_price" },
                        driver_name: { $first: "$driver_name" },
                        driving_license_image: { $first: "$driving_license_image" },
                        from_destination: { $first: "$from_destination" },
                        to_destination: { $first: "$to_destination" },
                        available_seats: { $first: "$available_seats" },


                        from_location: { $first: "$from_location" },
                        to_location: { $first: "$to_location" },
                        license_no: { $first: "$license_no" },
                        description: { $first: "$description" },
                        luggage_weight: { $first: "$luggage_weight" },
                        trip_status: { $first: "$trip_status" },

                        date_of_departure: { $first: "$date_of_departure" },
                        time_of_departure: { $first: "$time_of_departure" },
                        date_of_arrival: { $first: "$date_of_arrival" },
                        time_of_arrival: { $first: "$time_of_arrival" },

                        is_smoking: { $first: "$is_smoking" },
                        user_id: { $first: "$user_id" },
                        vehicleData: { $first: "$vehicleData" },
                        riderData: { $push: "$riderData" }
                    }
                },
            ])


            let vehicleId = tripDetail[0].vehicleData[0]._id;


            let userVehicle = await UserVehicle.findOne({ _id: vehicleId }).populate('type_id').
                populate('model_id').
                populate('make_id').
                populate('user_id', 'avatar name').
                lean().exec()


            tripDetail[0]['userVehicle'] = userVehicle;


            delete tripDetail[0]['vehicleData'];



            let from_lat = tripDetail[0].from_location.coordinates[0];
            let from_lng = tripDetail[0].from_location.coordinates[1];
            let to_lat = tripDetail[0].to_location.coordinates[0];
            let to_lng = tripDetail[0].to_location.coordinates[1];

            let distance = await Helper.distanceCalculate(from_lat, to_lat, from_lng, to_lng)
            tripDetail[0]['distance'] = parseInt(distance) + " KM";



          
            let reviews = await Review.find({ driver_id: userVehicle.user_id }).lean().exec();

            return res.status(200).send({ status: 200, data: tripDetail[0], reviews, message: "booked trip detail data" });
        } catch (e) {
            return res.status(400).send({ status: 400, message: e.message });
        }
    },

    updateTrip: async (req, res, next) => {

        try {
            let license = '';
            const obj = {};
            if (req.files && req.files[0] && req.files[0].location) {
                license = req.files[0].location;
                obj.driving_license_image = license;
            }
            for (let [key, value] of Object.entries(req.body)) {
                obj[key] = value;
            }
            var to = JSON.parse("[" + req.body.from_location + "]");
            var from = JSON.parse("[" + req.body.to_location + "]");
            obj.from_location = { "type": "Point", "coordinates": to }
            obj.to_location = { "type": "Point", "coordinates": from }
            await UserTrip.findByIdAndUpdate(obj.trip_id, obj).lean().exec();
            return res.send({ status: 200, message: 'Trip updated successfully' });

        } catch (error) {
            return res.send({ status: 400, message: error.message });
        }
    },


    //function for nearby trips 

    nearBytrip: async (req, res, next) => {

        // try {


        // GET TRIP ON TODAY DATE
        //     const today = moment().startOf('day')
        //     const trips = await UserTrip.find(
        //         // {}
        //         {
        //             created_at: {
        //                 $gte: today.toDate(), 
        //             }
        //         }
        //     ).populate('vehicle_id', 'images').populate('user_id', 'avatar');

        //     console.log(trips)
        //     console.log(trips)


        //     return res.status(200).send({ data: trips });
        // } catch (e) {
        //     return res.status(400).send({ message: e.error });
        // }
        // console.log('working sdfsdfsdf12')


        const { date, fromLat, fromLong } = req.body;

        UserTrip.find({
            // $and: [{
            //     from_location: {
            //         $near: {
            //             $maxDistance: 25000,
            //             $geometry: {
            //                 type: "Point",
            //                 coordinates: [fromLat, fromLong]
            //             }
            //         }
            //     }
            // },
            // {
            //     date_of_departure: {
            //         $gte: `${date}T00:00:00.000Z`,
            //         $lt: `${date}T23:59:59.999Z`
            //     }
            // }
            // ]
        }, function (err, trips) {

            if (err) {
                return res.status(400).send({ message: err.message });
            }
            console.log(trips);
            return res.status(200).send({ data: trips });
        }).populate('user_id');



    },



    // nearBytrip:async (req, res, next) => {
    //     const {date,fromLatt,fromLong,fromCity,toCity} = req.body ;
    //      UserTrip.find({$and:[{from_location: {
    //         $near: {
    //             $maxDistance: 25000,
    //             $geometry: {
    //                 type: "Point",
    //                 coordinates: [fromLatt, fromLong]
    //                }
    //            }
    //        }},{date_of_departure:{
    //            $gte: `${date}T00:00:00.000Z`, 
    //            $lt: `${date}T23:59:59.999Z`
    //        }},{from_city:fromCity,to_city:toCity}]}, function(err, trips) 
    //        {
    //           if (err)
    //           {
    //               return res.status(400).send({message: err.message });
    //           }
    //            console.log(trips) ;
    //           return res.status(200).send({data: trips });
    //        }).populate('user_id');

    //    },


    nearBytripDetail: async (req, res, next) => {

        // try {

        let { trip_id } = req.body;
        const tripDetail = await UserTrip.findOne({ _id: trip_id }).populate('user_id').lean().exec();

        let userVehicle = await UserVehicle.findOne({ user_id: tripDetail.user_id._id }).populate('type_id').
            populate('model_id').
            populate('make_id').
            lean().exec()

        tripDetail['userVehicle'] = userVehicle;


        let from_lat = tripDetail.from_location.coordinates[0];
        let from_lng = tripDetail.from_location.coordinates[1];
        let to_lat = tripDetail.to_location.coordinates[0];
        let to_lng = tripDetail.to_location.coordinates[1];

        let distance = await Helper.distanceCalculate(from_lat, to_lat, from_lng, to_lng)
        tripDetail['distance'] = parseInt(distance) + " KM";


        let reviews = await Review.find({driver_id: tripDetail.user_id}).lean().exec();

        return res.status(200).send({ status: 200, tripDetail: tripDetail, reviews:reviews.reverse()  });
        // } catch (error) {
        //     return res.status(400).send({ status: 400, message: error.message });
        // }

    },

    initiateTripPayment: async (req, res, next) => {

        try {
            let reqData = req.body;
            let user_id = reqData.user_id;
            let trip_id = reqData.trip_id;

            const tripDetail = await UserTrip.findOne({ _id: trip_id });

            if (tripDetail.trip_status != "NOT_STARTED") {
                console.log('already started')
                return res.send({ status: 400, message: "This trip has been already started" });
            }

            if (!reqData.total_seats && reqData.trip_type != "LUGGAGE") {
                console.log('select seats')
                return res.send({ status: 400, message: "Please select seats how many do you want?" });
            }
            console.log('working')

            // TRIP AND LUGGAGE PRICING CALCULATE  
            let amount = 0;
            if (reqData.trip_type == "LUGGAGE") {
                amount = tripDetail.luggage_price;
            } else {
                amount = tripDetail.travel_price * reqData.total_seats;
            }
            reqData['status'] = "INTRESTED";
            reqData['amount'] = amount;

            let ride = await new Rider(reqData).save();
            let ride_id = ride._id


            // INITITAL STRIPE PAYMENT DETAILS AND REDIRECT TO STRIPE PAYMENT SCREEN 
            const paymentIntent = await stripe.paymentIntents.create({
                amount: amount * 100,
                currency: "INR",
                payment_method_types: ["card"],
                metadata: {
                    trip_id: trip_id + '',
                    ride_id: ride_id + '',
                    name: "sunil"
                }
            });

            const clientSecret = paymentIntent.client_secret;
            let paymentData = {
                ride_id,
                trip_id,
                amount,
                payment_intent_id: paymentIntent.id,
                currency: paymentIntent.currency,
                client_secret: clientSecret
            }

            let stripe_payment = await StripePayment(paymentData).save();

            let stripeData = {
                stripe_payment_id: stripe_payment._id,
                ride_id: ride_id,
            }

            return res.status(200).send({ status: 200, clientSecret, stripeData, message: "Payment initiated" });



            // let notificationData = {
            //     user_id: tripDetail.user_id,
            //     message: `${reqData.rider_name} has been sends you a request ride.`
            // };

            // await Notification(notificationData).save();
            // await firebase.sendPushNotificationToSingleUser(notificationData);


            // return res.status(200).send({ status: 200, message: "Trip created successfully" });


        } catch (error) {
            return res.status(400).send({ status: 400, message: error.message });
        }
    },


    tripPayment: async (req, res, next) => {

        // try {

        let { stripe_payment_id, ride_id, payment_status } = req.body;
        console.log('working')

        // console.log('reqData', reqData)


        await StripePayment.updateOne({
            _id: stripe_payment_id,
            ride_id,
        },
            {
                $set: { payment_status }
            });

        return res.status(200).send({ status: 200, message: "Ride successfully created.." });

        // const paymentIntent = await stripe.paymentIntents.create({
        //     amount: Math.round(25 * 100),
        //     currency: "INR",
        //     payment_method_types: ["card"],
        //     metadata: {
        //         trip_id, 
        //         user_id
        //     }
        // });

        // const clientSecret = paymentIntent.client_secret;

        // let paymentData = {
        //     user_id, 
        //     trip_id,
        //     amount,
        //     payment_intent_id: paymentIntent.id,
        //     currency: paymentIntent.currency, 
        //     client_secret: clientSecret
        // }

        // await StripePayment(paymentData).save();


        // console.log(clientSecret)

        return res.status(200).send({ status: 200, clientSecret, message: "Payment initiated" });
        // } catch (error) {
        //     return res.status(400).send({ status: 400, message: error.message });
        // }

    },



    confirmTripTest: async (req, res, next) => {


        try {

            let reqData = req.body;
            let user_id = reqData.user_id;
            let trip_id = reqData.trip_id;

            const tripDetail = await UserTrip.findOne({ _id: trip_id, });

            if (tripDetail.trip_status != "NOT_STARTED") {
                console.log('already started')
                return res.send({ status: 400, message: "This trip has been already started" });
            }

            if (!reqData.total_seats && reqData.trip_type != "LUGGAGE") {
                console.log('select seats')
                return res.send({ status: 400, message: "Please select seats how many do you want?" });
            }

            if (reqData.total_seats > tripDetail.available_seats) {
                return res.status(200).send({ status: 400, message: "Seats not available." });
            }

            let amount = 0;
            if (reqData.trip_type == "LUGGAGE") {
                amount = tripDetail.luggage_price;
            } else {
                amount = tripDetail.travel_price * reqData.total_seats;
            }
            reqData['status'] = "INTRESTED";
            reqData['amount'] = amount;

            let ride = await new Rider(reqData).save();

            if (ride.trip_type != "LUGGAGE") {
                let remaining_seats = 0;
                remaining_seats = tripDetail.available_seats - ride.total_seats;
                await UserTrip.updateOne({ _id: trip_id }, { $set: { available_seats: remaining_seats } });
            }


            return res.status(200).send({ status: 200, message: "Ride successfully created.." });

        } catch (e) {
            return res.status(400).send({ status: 200, message: "Something went wrong in api." });
        }


    },

    acceptDeclineTrip: async (req, res, next) => {

        try {
            let { status, rider_id } = req.body;

            console.log(req.body)
            // await Rider.update({_id: rider_id}, { $set: { status: status } });
            await Rider.updateOne({ _id: rider_id }, { status: status });

            return res.status(200).send({ status: 200, message: `User ride ${status} successfully` });
        } catch (error) {
            return res.status(400).send({ status: 400, message: error.message });
        }

    },


    tripStatusUpdate: async (req, res, next) => {

        try {
            let { trip_status, trip_id } = req.body;
            console.log(req.body)

            await UserTrip.updateOne({ _id: trip_id }, { trip_status: trip_status });

            if (trip_status === "FINISHED") {
                await Rider.updateMany({ trip_id: trip_id, status: "PICKUP" }, { status: 'FINISHED' });
            }

            return res.status(200).send({ status: 200, message: `Trip status updated successfully` });
        } catch (error) {
            return res.status(400).send({ status: 400, message: error.message });
        }

    },

    rideStatusUpdate: async (req, res, next) => {
        try {
            let { ride_status, ride_id } = req.body;
            console.log(req.body)

            await Rider.updateOne({ _id: ride_id }, { status: ride_status });

            return res.status(200).send({ status: 200, message: `Ride status updated successfully` });
        } catch (error) {
            return res.status(400).send({ status: 400, message: error.message });
        }

    },



    deleteCar: async (req, res, next) => {
        try {

            const reqQuery = req.query;
            const slug = reqQuery.slug;

            if (!slug) {
                return res.send({ status: 400, message: '_id is required' });
            }
            const deleted = await Car.findOneAndRemove({ _id: slug }).lean().exec();

            if (!deleted) {
                return res.send({ status: 400, message: 'Car not found' });
            }
            return res.send({ status: 200, message: 'Car deleted successfully' });
        } catch (error) {
            return res.send({ status: 400, message: error.message });
        }
    },







    getCars: async (req, res, next) => {
        try {
            const cars = await Car.find();
            if (cars.length === 0) {
                return res.send({ status: 400, message: 'cars not found' });
            }
            return res.send({ status: 200, data: cars });

        } catch (error) {
            return res.send({ status: 400, message: error.message });
        }
    },

    getAllCars: async (req, res, next) => {
        try {

            const reqBody = req.body;
            const Limit = reqBody.limit ? parseInt(reqBody.limit) : 10;
            const PageNo = reqBody.page ? parseInt(reqBody.page) : 0;
            const AllPages = await Car.find().sort({ updated_at: -1 }).skip(Limit * PageNo).limit(Limit).lean().exec();
            const count = await Car.count();
            return res.send({ status: true, data: AllPages, count: count, message: 'All Page get successfully' });

        } catch (error) {
            return res.send({ status: false, message: error.message });
        }
    },

    getCarDetail: async (req, res, next) => {
        try {

            const reqQuery = req.query;
            const slug = reqQuery.slug;

            const cars = await Car.find({ _id: slug }).lean().exec();

            return res.send({ status: 200, data: cars });

        } catch (error) {
            return res.send({ status: 400, message: error.message });
        }
    },

    //-------------------------END--------------------//

    //---------------- Functions for cars models modules -------------//


    createCarModel: async (req, res, next) => {
        try {
            const { car_id, car_model, isActive } = req.body;
            const status = isActive === '' ? false : true;

            const data = {
                car_id,
                car_model,
                isAction: status
            }
            let findModal = await CarModel.find({ car_model })

            if (findModal.length > 0) {
                res.send({ status: 400, message: "This Car Modal is already exits" });
                return false;
            }
            const carModel = new CarModel(data);
            const created = await carModel.save();
            return res.send({ status: 200, message: 'Car Model created successfully' });

        } catch (error) {
            return res.send({ status: 400, message: error.message });
        }
    },

    updateCarModel: async (req, res, next) => {
        try {
            const reqBody = req.body;
            const Id = reqBody._id;
            reqBody.isActive = reqBody.isActive === '' ? false : true;

            let findCarModel = await CarModel.find({ _id: { $ne: Id }, car_model: reqBody.car_model });
            if (findCarModel.length > 0) {
                res.send({ status: 400, message: "Car Model Already Exits" });
                return false;
            }
            await CarModel.findByIdAndUpdate(Id, reqBody).lean().exec();
            return res.send({ status: 200, message: 'Car Model updated successfully' });

        } catch (error) {
            return res.send({ status: 400, message: error.message });
        }
    },



    getCarModel: async (req, res, next) => {
        try {
            const { car_id } = req.body;
            const carModels = await CarModel.find({ car_id });
            if (carModels.length === 0) {
                return res.send({ status: 400, message: 'car models not found' });
            }
            return res.send({ status: 200, data: carModels, message: 'Car modal get successfully' });
        } catch (error) {
            return res.send({ status: 400, message: error.message });
        }
    },

    getAllCarModels: async (req, res, next) => {
        try {

            const reqBody = req.body;
            const Limit = reqBody.limit ? parseInt(reqBody.limit) : 10;
            const PageNo = reqBody.page ? parseInt(reqBody.page) : 0;
            const AllPages = await CarModel.find().sort({ updated_at: -1 }).skip(Limit * PageNo).limit(Limit).lean().exec();
            const count = await CarModel.count();
            return res.send({ status: true, data: AllPages, count: count, message: 'Car Model get successfully' });

        } catch (error) {
            return res.send({ status: false, message: error.message });
        }
    },

    deleteCarModel: async (req, res, next) => {
        try {
            const reqQuery = req.query;
            const slug = reqQuery.slug;

            if (!slug) {
                return res.send({ status: 400, message: '_id is required' });
            }
            const deleted = await CarModel.findOneAndRemove({ _id: slug }).lean().exec();

            if (!deleted) {
                return res.send({ status: 400, message: 'Car Model not found' });
            }
            return res.send({ status: 200, message: 'Car Model deleted successfully' });
        } catch (error) {
            return res.send({ status: 400, message: error.message });
        }
    },

    getCarModelDetail: async (req, res, next) => {
        try {

            const reqQuery = req.query;
            const slug = reqQuery.slug;
            const cars = await CarModel.find({ _id: slug }).lean().exec();
            return res.send({ status: 200, data: cars });

        } catch (error) {
            return res.send({ status: 400, message: error.message });
        }
    },

    //-------------------------END--------------------//
    //---------------- Functions for cars colors  -------------//

    createColor: async (req, res, next) => {

        try {
            const { title, isActive } = req.body;
            const status = isActive === '' ? false : true;
            const data = {
                title,
                isActive: status
            }
            let findColor = await Color.find({ title });

            if (findColor.length > 0) {
                res.send({ status: 400, message: "Color Already Exits" });
                return false;
            }

            const Colors = new Color(data);
            const created = await Colors.save();
            return res.send({ status: 200, message: 'Car Color created successfully' });
        } catch (error) {
            return res.send({ status: 400, message: error.message });
        }
    },

    updateColor: async (req, res, next) => {
        try {
            const reqBody = req.body;
            const Id = reqBody._id;

            reqBody.isActive = reqBody.isActive === '' ? false : true;

            let findColor = await Color.find({ _id: { $ne: Id }, title: reqBody.title });

            if (findColor.length > 0) {
                res.send({ status: 400, message: "Color Already Exits" });
                return false;
            }

            if (!Id) {
                return res.send({ status: 400, message: 'Id is required' });
            }
            await Color.findByIdAndUpdate(Id, reqBody).lean().exec();
            return res.send({ status: 200, message: 'Color updated successfully' });
        } catch (error) {
            return res.send({ status: 400, message: error.message });
        }
    },

    deleteColor: async (req, res, next) => {
        try {
            const reqQuery = req.query;
            const slug = reqQuery.slug;

            if (!slug) {
                return res.send({ status: 400, message: '_id is required' });
            }
            const deleted = await Color.findOneAndRemove({ _id: slug }).lean().exec();

            if (!deleted) {
                return res.send({ status: 400, message: 'Color not found' });
            }
            return res.send({ status: 200, message: 'Color deleted successfully' });
        } catch (error) {
            return res.send({ status: 400, message: error.message });
        }
    },

    getColor: async (req, res, next) => {
        try {
            const colors = await Color.find();
            if (colors.length === 0) {
                return res.send({ status: 400, message: 'colors not found' });
            }
            return res.send({ status: 200, data: colors });
        } catch (error) {
            return res.send({ status: 400, message: error.message });
        }
    },

    getAllColor: async (req, res, next) => {
        try {

            const reqBody = req.body;
            const Limit = reqBody.limit ? parseInt(reqBody.limit) : 10;
            const PageNo = reqBody.page ? parseInt(reqBody.page) : 0;
            const AllPages = await Color.find().sort({ updated_at: -1 }).skip(Limit * PageNo).limit(Limit).lean().exec();
            const count = await Color.count();
            return res.send({ status: true, data: AllPages, count: count, message: 'All Page get successfully' });

        } catch (error) {
            return res.send({ status: false, message: error.message });
        }
    },

    getColorDetail: async (req, res, next) => {
        try {

            const reqQuery = req.query;
            const slug = reqQuery.slug;
            const colors = await Color.find({ _id: slug }).lean().exec();
            return res.send({ status: 200, data: colors });

        } catch (error) {
            return res.send({ status: 400, message: error.message });
        }
    },

    //-------------------------END--------------------//
    //---------------- Functions for cars type  -------------//

    createCarType: async (req, res, next) => {

        try {
            const { title, isActive } = req.body;
            const status = isActive === '' ? false : true;
            const data = {
                title,
                isActive: status
            }

            let findCarType = await CarType.find({ title });

            if (findCarType.length > 0) {
                res.send({ status: 400, message: "Car Type Already Exits" });
                return false;
            }

            const CarTypes = new CarType(data);
            const created = await CarTypes.save();
            return res.send({ status: 200, message: 'Car Type created successfully' });
        } catch (error) {
            return res.send({ status: 400, message: error.message });
        }
    },

    updateCarType: async (req, res, next) => {
        try {
            const reqBody = req.body;
            const Id = reqBody._id;
            reqBody.isActive = reqBody.isActive === '' ? false : true
            let findCarType = await CarType.find({ _id: { $ne: Id }, title: reqBody.title });

            if (findCarType.length > 0) {
                res.send({ status: 400, message: "Car type Already Exits" });
                return false;
            }

            if (!Id) {
                return res.send({ status: 400, message: 'Id is required' });
            }
            await CarType.findByIdAndUpdate(Id, reqBody).lean().exec();
            return res.send({ status: 200, message: 'Car type updated successfully' });
        } catch (error) {
            return res.send({ status: 400, message: error.message });
        }
    },

    deleteCarType: async (req, res, next) => {
        try {
            const reqQuery = req.query;
            const slug = reqQuery.slug;

            if (!slug) {
                return res.send({ status: 400, message: '_id is required' });
            }
            const deleted = await CarType.findOneAndRemove({ _id: slug }).lean().exec();

            if (!deleted) {
                return res.send({ status: 400, message: 'Color not found' });
            }
            return res.send({ status: 200, message: 'Car Type deleted successfully' });
        } catch (error) {
            return res.send({ status: 400, message: error.message });
        }
    },

    getCarType: async (req, res, next) => {
        try {
            const carTypes = await CarType.find();
            if (carTypes.length === 0) {
                return res.send({ status: 400, message: 'cars not found' });
            }
            return res.send({ status: 200, data: carTypes });
        } catch (error) {
            return res.send({ status: 400, message: error.message });
        }
    },

    getAllCarType: async (req, res, next) => {
        try {

            const reqBody = req.body;
            const Limit = reqBody.limit ? parseInt(reqBody.limit) : 10;
            const PageNo = reqBody.page ? parseInt(reqBody.page) : 0;
            const AllPages = await CarType.find().sort({ updated_at: -1 }).skip(Limit * PageNo).limit(Limit).lean().exec();
            const count = await CarType.count();
            return res.send({ status: true, data: AllPages, count: count, message: 'All Page get successfully' });

        } catch (error) {
            return res.send({ status: false, message: error.message });
        }
    },

    getCarTypeDetail: async (req, res, next) => {
        try {

            const reqQuery = req.query;
            const slug = reqQuery.slug;
            const carTypes = await CarType.find({ _id: slug }).lean().exec();
            return res.send({ status: 200, data: carTypes });

        } catch (error) {
            return res.send({ status: 400, message: error.message });
        }
    },







}
