const {
  UserTrip,
  UserVehicle,
  Rider,
  Notification,
  StripePayment,
  Review,
  UserLogins,
  WithdrawRequest,
} = require("../_helper/db");
var path = require("path");
var fs = require("fs");
const mongoose = require("mongoose");
const aws = require("aws-sdk");
const S3image_url = "https://choovoo-test.s3.ap-south-1.amazonaws.com/";
const Helper = require("../core/helper");
const moment = require("moment");
const firebase = require("../_helper/firebase/firebase");
aws.config.update({
  secretAccessKey: "aoSbNdNF3K2+z31gGJX31RuKTNijkfPWwRxymHAV",
  accessKeyId: "AKIAXRCHJ4CSM5C36R77",
  region: "ap-south-1",
});
const s3Bucket = new aws.S3({ params: { Bucket: "choovoo-test" } });
const Stripe = require("stripe");
const { getReviewRatingCalculate } = require("../core/helper");

// pk_test_51KPYTTGiLl4WeKJDyuCqOvFr5Ik46g7r3fUz7vHYyZFMWJkaTNSoTKA6KhofWFfTj9kMeQ3XFrHgySv2PtSCXL5Q00hxDwNakU

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
module.exports = {
  //---------------- Functions for trips modules -------------//

  createTrip: async (req, res, next) => {
    try {
      let license = "";

      let { date_of_departure, date_of_arrival } = req.body;
      if (date_of_departure) {
        let departure = moment(date_of_departure).format("YYYY-MM-DD");
        let dep_data = req.body["time_of_departure"].split("T");
        dep_data[0] = departure;
        req.body["time_of_departure"] = dep_data.join("T");
      }

      if (date_of_arrival) {
        let arrival = moment(date_of_arrival).format("YYYY-MM-DD");
        let arr_data = req.body["time_of_arrival"].split("T");
        arr_data[0] = arrival;
        req.body["time_of_arrival"] = arr_data.join("T");
      }

      // console.log(req.body)
      // return ;
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
      obj.from_location = { type: "Point", coordinates: to };
      obj.to_location = { type: "Point", coordinates: from };

      const Trip = new UserTrip(obj);
      await Trip.save();
      console.log("working");
      return res
        .status(200)
        .send({ status: 200, message: "Trip created successfully" });
    } catch (error) {
      return res.status(400).send({ status: 400, message: error.message });
    }
  },

  getTrips: async (req, res, next) => {
    try {
      let search = req.query.search;
      console.log("search", search);

      let user_id = req.body.user_id;

      let trips = await UserTrip.aggregate([
        {
          $match: {
            user_id: mongoose.Types.ObjectId(user_id),
          },
        },
        {
          $match: {
            $or: [
              { from_destination: { $regex: search, $options: "i" } },
              { to_destination: { $regex: search, $options: "i" } },
            ],
          },
        },
        {
          $lookup: {
            from: "user_vehicles",
            localField: "vehicle_id",
            foreignField: "_id",
            as: "vehicleData",
          },
        },
        {
          $lookup: {
            from: "riders",
            localField: "_id",
            foreignField: "trip_id",
            as: "riderData",
          },
        },
        {
          $unwind: {
            path: "$riderData",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "riderData.user_id",
            foreignField: "_id",
            as: "riderData.userDetail",
          },
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

            date_of_arrival: { $first: "$date_of_arrival" },
            time_of_arrival: { $first: "$time_of_arrival" },

            is_smoking: { $first: "$is_smoking" },
            user_id: { $first: "$user_id" },
            vehicleData: { $first: "$vehicleData" },
            riderData: { $push: "$riderData" },
          },
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
            date_of_arrival: 1,
            time_of_arrival: 1,
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
          },
        },

        { $sort: { _id: -1 } },
      ]).exec();

      // Add Distance to all trips with lat long

      // let trips = await UserTrip.find({ user_id: user_id }).populate('vehicle_id').lean().exec();

      //let rides = await Rider.find({ user_id: user_id }).sort({ 'created_at': -1 }).populate('trip_id').lean().exec();

      let rides = await Rider.aggregate([
        {
          $match: {
            user_id: mongoose.Types.ObjectId(user_id),
            status: { $ne: "PAYMENT_PENDING" },
            status: { $ne: "PAYMENT_FAILED" },
          },
        },

        {
          $lookup: {
            from: "user_trips",
            localField: "trip_id",
            foreignField: "_id",
            as: "trip_id",
          },
        },
        {
          $unwind: {
            path: "$trip_id",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "user_vehicles",
            localField: "trip_id.vehicle_id",
            foreignField: "_id",
            as: "trip_id.vehicleData",
          },
        },
        {
          $lookup: {
            from: "reviews",
            localField: "trip_id.user_id",
            foreignField: "driver_id",
            as: "driverReviews",
          },
        },
        // {
        //     $group: {
        //         _id: "$_id",
        //         trip_id : {$push : "$trip_id"},
        //         driverReviews: {$push : "$driverReviews"},
        //         // package_desc: {$first : "$package_desc"},
        //         // package_price: {$first : "$package_price"}
        //     }
        // },
        { $sort: { _id: -1 } },
      ]).exec();

      // TRIP CREATOR USER TOTAL REVIEW RATINGS
      let promises = rides.map((item) => {
        let reviews;
        if (item && item.driverReviews) {
          reviews = item.driverReviews;
          let totalRating = 0;
          if (reviews.length > 0) {
            totalRating = Helper.getReviewRatingCalculate(reviews);
          }
          item["totalRating"] = totalRating;
        }

        return item;
      });

      // REMOVE UNNECESSARY DRIVER REVIEW DATA BECAUSE WE CALCULATE DRIVER LISTING REVIEW
      rides = await Promise.all(promises);

      rides.map((item) => {
        delete item.driverReviews;
        return item;
      });

      return res.status(200).send({
        status: 200,
        data: trips,
        rides: rides,
        message: "trips get successfully",
      });
    } catch (e) {
      console.log(e);
      return res.status(400).send({ status: 400, message: e.message });
    }
  },

  passengerBookedTripDetail: async (req, res, next) => {
    try {
      let { rider_id, trip_id } = req.body;

      console.log(req.body);
      let tripDetail = await UserTrip.aggregate([
        { $match: { _id: mongoose.Types.ObjectId(trip_id) } },
        {
          $lookup: {
            from: "user_vehicles",
            localField: "vehicle_id",
            foreignField: "_id",
            as: "vehicleData",
          },
        },
        {
          $lookup: {
            from: "riders",
            let: {
              id: "$_id", //All UserTrip variables,
            },

            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $ne: ["$status", "PAYMENT_FAILED"] },
                      { $ne: ["$status", "PAYMENT_PENDING"] },
                      // { $eq: ["$user_id", `${rider_id}`] },
                      {
                        $eq: [
                          "$$id", //localField variable it can be used only in $expr
                          "$trip_id", //foreignField
                        ],
                      },
                    ],
                  },
                },
              },
            ],
            as: "riderData",
          },
        },
        {
          $unwind: {
            path: "$riderData",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "riderData.user_id",
            foreignField: "_id",
            as: "riderData.userDetail",
          },
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
            riderData: { $push: "$riderData" },
          },
        },
      ]);

      // let tripDetail = await UserTrip.aggregate([
      //   { $match: { _id: mongoose.Types.ObjectId(trip_id) } },
      //   {
      //     $lookup: {
      //       from: "user_vehicles",
      //       localField: "vehicle_id",
      //       foreignField: "_id",
      //       as: "vehicleData",
      //     },
      //   },
      //   {
      //     $lookup: {
      //       from: "riders",
      //       localField: "_id",
      //       foreignField: "trip_id",
      //       as: "riderData",
      //       pipeline: [
      //         {
      //           $match: {
      //             // "$riderData.user_id": mongoose.Types.ObjectId(rider_id),
      //             status: { $ne: "PAYMENT_PENDING" },
      //             status: { $ne: "PAYMENT_FAILED" },
      //           },
      //         },
      //       ],
      //     },
      //   },
      //   {
      //     $unwind: {
      //       path: "$riderData",
      //       preserveNullAndEmptyArrays: true,
      //     },
      //   },
      //   {
      //     $lookup: {
      //       from: "users",
      //       localField: "riderData.user_id",
      //       foreignField: "_id",
      //       as: "riderData.userDetail",
      //     },
      //   },
      //   {
      //     $group: {
      //       _id: "$_id",
      //       user_id: { $first: "$user_id" },
      //       travel_price: { $first: "$travel_price" },
      //       luggage_price: { $first: "$luggage_price" },
      //       driver_name: { $first: "$driver_name" },
      //       driving_license_image: { $first: "$driving_license_image" },
      //       from_destination: { $first: "$from_destination" },
      //       to_destination: { $first: "$to_destination" },
      //       available_seats: { $first: "$available_seats" },

      //       from_location: { $first: "$from_location" },
      //       to_location: { $first: "$to_location" },
      //       license_no: { $first: "$license_no" },
      //       description: { $first: "$description" },
      //       luggage_weight: { $first: "$luggage_weight" },
      //       trip_status: { $first: "$trip_status" },

      //       date_of_departure: { $first: "$date_of_departure" },
      //       time_of_departure: { $first: "$time_of_departure" },
      //       date_of_arrival: { $first: "$date_of_arrival" },
      //       time_of_arrival: { $first: "$time_of_arrival" },

      //       is_smoking: { $first: "$is_smoking" },
      //       user_id: { $first: "$user_id" },
      //       vehicleData: { $first: "$vehicleData" },
      //       riderData: { $push: "$riderData" },
      //     },
      //   },
      // ]);

      let vehicleId = tripDetail[0].vehicleData[0]._id;

      let userVehicle = await UserVehicle.findOne({ _id: vehicleId })
        .populate("type_id")
        .populate("model_id")
        .populate("make_id")
        .populate("user_id", "avatar name")
        .lean()
        .exec();

      tripDetail[0]["userVehicle"] = userVehicle;

      delete tripDetail[0]["vehicleData"];

      let from_lat = tripDetail[0].from_location.coordinates[0];
      let from_lng = tripDetail[0].from_location.coordinates[1];
      let to_lat = tripDetail[0].to_location.coordinates[0];
      let to_lng = tripDetail[0].to_location.coordinates[1];

      let distance = await Helper.distanceCalculate(
        from_lat,
        to_lat,
        from_lng,
        to_lng
      );
      tripDetail[0]["distance"] = parseInt(distance) + " KM";

      let reviews = await Review.find({ driver_id: userVehicle.user_id })
        .lean()
        .exec();
      let totalRating = await getReviewRatingCalculate(reviews);
      tripDetail[0]["totalRating"] = totalRating;

      console.log(tripDetail[0].riderData);

      return res.status(200).send({
        status: 200,
        data: tripDetail[0],
        reviews,
        message: "booked trip detail data",
      });
    } catch (e) {
      console.log("error00", e);
      return res.status(400).send({ status: 400, message: e.message });
    }
  },

  driverCreatedTripDetail: async (req, res, next) => {
    try {
      let trip_id = req.body.trip_id;

      let tripDetail = await UserTrip.aggregate([
        { $match: { _id: mongoose.Types.ObjectId(trip_id) } },
        {
          $lookup: {
            from: "user_vehicles",
            localField: "vehicle_id",
            foreignField: "_id",
            as: "vehicleData",
          },
        },
        {
          $lookup: {
            from: "riders",
            localField: "_id",
            foreignField: "trip_id",
            as: "riderData",
            // pipeline: [
            //   {
            //         $match: {
            //           status: { $ne: "PAYMENT_PENDING" || "PAYMENT_FAILED" },

            //     },
            //   },
            // ],
          },
        },
        {
          $unwind: {
            path: "$riderData",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "riderData.user_id",
            foreignField: "_id",
            as: "riderData.userDetail",
          },
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
            riderData: { $push: "$riderData" },
          },
        },
      ]);

      let vehicleId = tripDetail[0].vehicleData[0]._id;

      let userVehicle = await UserVehicle.findOne({ _id: vehicleId })
        .populate("type_id")
        .populate("model_id")
        .populate("make_id")
        .populate("user_id", "avatar name")
        .lean()
        .exec();

      tripDetail[0]["userVehicle"] = userVehicle;

      delete tripDetail[0]["vehicleData"];

      let from_lat = tripDetail[0].from_location.coordinates[0];
      let from_lng = tripDetail[0].from_location.coordinates[1];
      let to_lat = tripDetail[0].to_location.coordinates[0];
      let to_lng = tripDetail[0].to_location.coordinates[1];

      let distance = await Helper.distanceCalculate(
        from_lat,
        to_lat,
        from_lng,
        to_lng
      );
      tripDetail[0]["distance"] = parseInt(distance) + " KM";

      let reviews = await Review.find({ driver_id: userVehicle.user_id })
        .lean()
        .exec();
      let totalRating = await getReviewRatingCalculate(reviews);
      tripDetail[0]["totalRating"] = totalRating;

      return res.status(200).send({
        status: 200,
        data: tripDetail[0],
        reviews,
        message: "booked trip detail data",
      });
    } catch (e) {
      return res.status(400).send({ status: 400, message: e.message });
    }
  },

  updateTrip: async (req, res, next) => {
    try {
      let license = "";
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
      obj.from_location = { type: "Point", coordinates: to };
      obj.to_location = { type: "Point", coordinates: from };
      await UserTrip.findByIdAndUpdate(obj.trip_id, obj).lean().exec();
      return res.send({ status: 200, message: "Trip updated successfully" });
    } catch (error) {
      return res.send({ status: 400, message: error.message });
    }
  },

  //function for nearby trips

  nearBytrip: async (req, res, next) => {
    try {
      const {
        date,
        fromLat,
        fromLong,
        destinationLat,
        destinationLong,
        destination_city,
        destination_state,
      } = req.body;

      console.log("req.body");
      console.log(req.body);
      let dateFormat = moment(date).format("yyyy-MM-DD");

      console.log("date");
      console.log(dateFormat);

      let trips = await UserTrip.find({
        from_location: {
          $near: {
            $maxDistance: 25000,
            $geometry: {
              type: "Point",
              coordinates: [fromLong, fromLat],
            },
          },
        },
        date_of_departure: {
            $gte: `${dateFormat}T00:00:00.000Z`,
            $lt: `${dateFormat}T23:59:59.999Z`
        },
        trip_status: "NOT_STARTED",
      })
        .populate("vehicle_id", "images")
        .populate("user_id", "avatar");

      if (destination_city && destination_state) {
        trips = trips.filter((trip) => {
          if (
            destination_state == trip.to_state ||
            destination_state == trip.to_city
          ) {
            if (
              destination_city === trip.to_city ||
              trip.to_destination.includes(destination_city)
            ) {
              return trip;
            }
          }
        });
      }

      // console.log(trips)
      console.log("trips.length -----", trips.length);
      // console.log(trips)
      // return ;

      return res
        .status(200)
        .send({ data: trips, message: "Near by trips get successfully." });
    } catch (e) {
      console.log("error ----------", e);
      return res.status(400).send({ message: e.error });
    }
    // console.log('working sdfsdfsdf12')

    const { date, fromLat, fromLong } = req.body;

    UserTrip.find(
      {
        $and: [
          {
            from_location: {
              $near: {
                $maxDistance: 25000,
                $geometry: {
                  type: "Point",
                  coordinates: [fromLat, fromLong],
                },
              },
            },
          },
          {
            date_of_departure: {
              $gte: `${date}T00:00:00.000Z`,
              $lt: `${date}T23:59:59.999Z`,
            },
          },
        ],
      },
      function (err, trips) {
        if (err) {
          return res.status(400).send({ message: err.message });
        }
        console.log(trips);
        console.log(trips);
        return res.status(200).send({ data: trips });
      }
    ).populate("user_id");
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
    const tripDetail = await UserTrip.findOne({ _id: trip_id })
      .populate("user_id")
      .lean()
      .exec();

    let userVehicle = await UserVehicle.findOne({
      user_id: tripDetail.user_id._id,
    })
      .populate("type_id")
      .populate("model_id")
      .populate("make_id")
      .lean()
      .exec();

      
    tripDetail["userVehicle"] = userVehicle;
    let riderData = await Rider.find({ trip_id: tripDetail._id ,   $or: [ {status: 'CONFIRMED' }, {status: 'PICKUP' } ]  }).select('amount status').populate('user_id', 'name avatar')
    tripDetail["riderData"] = riderData;





    let from_lat = tripDetail.from_location.coordinates[0];
    let from_lng = tripDetail.from_location.coordinates[1];
    let to_lat = tripDetail.to_location.coordinates[0];
    let to_lng = tripDetail.to_location.coordinates[1];

    let distance = await Helper.distanceCalculate(
      from_lat,
      to_lat,
      from_lng,
      to_lng
    );
    tripDetail["distance"] = parseInt(distance) + " KM";

    let reviews = await Review.find({ driver_id: tripDetail.user_id })
      .lean()
      .exec();

    let totalRating = await getReviewRatingCalculate(reviews);
    tripDetail["totalRating"] = totalRating;


    return res.status(200).send({
      status: 200,
      tripDetail: tripDetail,
      reviews: reviews.reverse(),
    });
    // } catch (error) {
    //     return res.status(400).send({ status: 400, message: error.message });
    // }
  },


  walletTripPayment: async (req, res, next) => {
    try {
      let reqData = req.body;
      let passenger_id = reqData.user_id;
      let trip_id = reqData.trip_id;

      let passengerUser = await UserLogins.findById(passenger_id);

      const tripDetail = await UserTrip.findOne({ _id: trip_id });
      let driverId = tripDetail.user_id;
      reqData['driver_id'] = driverId;    
      
      

      if (tripDetail.trip_status != "NOT_STARTED") {
        console.log("already started");
        return res.send({
          status: 400,
          message: "Trip already started.",
        });
      }

      if (!reqData.total_seats && reqData.trip_type != "LUGGAGE") {
        console.log("select seats");
        return res.send({ status: 400, message: "Please select seats how many do you want?"});
      }

      if (reqData.trip_type != "LUGGAGE" &&  reqData.total_seats > tripDetail.available_seats) {
        console.log("select seats");
        return res.send({ status: 400, message: "Seats not available."});
      }
      
     
      // TRIP AND LUGGAGE PRICING CALCULATE
      let tripAmount = 0;
      if (reqData.trip_type == "LUGGAGE") {
        tripAmount = tripDetail.luggage_price;
      } else {
        tripAmount = tripDetail.travel_price * reqData.total_seats;
      }

      console.log('tripAmount', tripAmount);
      console.log('tripAmount', passengerUser.wallet_amount);
      if (tripAmount > passengerUser.wallet_amount) {
        return res.send({ status: 400, message: "Insufficient Wallet Balance."});
      }
      
      
      reqData["status"] = "INTRESTED";
      reqData["amount"] = tripAmount;
      let ride = await new Rider(reqData).save();

      let remainingBalance = passengerUser.wallet_amount - tripAmount;
      await UserLogins.findByIdAndUpdate(passenger_id, { $set: { wallet_amount: remainingBalance } })

      // // DEDUCT SEATS
      if (ride.trip_type != "LUGGAGE") {
        let remaining_seats = 0;
        remaining_seats = tripDetail.available_seats - ride.total_seats;
        await UserTrip.updateOne(
          { _id: ride.trip_id },
          { $set: { available_seats: remaining_seats } }
        );
      }

      // ADD AMOUNT TO DRIVER WALLET WHEN PASSENGER PAID TRIP AMOUNT
      let usersAmount = await UserLogins.findById(tripDetail.user_id);
      let amount = usersAmount.wallet_amount + ride.amount;
      await UserLogins.findByIdAndUpdate(usersAmount._id, { $set: { wallet_amount: amount } });

      // SAVE AND SEND NOTIFICATION TO DRIVER
      let passengerName = passengerUser.name;
      let messageData = {
        user_id: tripDetail.user_id,
        message: `You have a new requested ride from a ${passengerName}.`,
        type: "MY_TRIP_DETAIL",
        reference_id: tripDetail._id,
      };
      await Notification(messageData).save();
      let notificationData = {
        user_id: tripDetail.user_id,
        message: `You have a new requested ride from a ${passengerName}.`,
      };
      await firebase.sendPushNotificationToSingleUser(notificationData);



      return res.status(200).send({
        status: 200,      
        message: "Your trip successfully created.",
      });

      // let notificationData = {
      //     user_id: tripDetail.user_id,
      //     message: `${reqData.rider_name} has been sends you a request ride.`
      // };

      // await Notification(notificationData).save();
      // await firebase.sendPushNotificationToSingleUser(notificationData);

      // return res.status(200).send({ status: 200, message: "Trip created successfully" });
    } catch (error) {
      console.log('catch error', error.message);
      return res.status(400).send({ status: 400, message: error.message });
    }
  },


  initiateTripPayment: async (req, res, next) => {
    try {
      let reqData = req.body;
      let passenger_id = reqData.user_id;
      let trip_id = reqData.trip_id;

      const tripDetail = await UserTrip.findOne({ _id: trip_id });
      reqData['driver_id'] = tripDetail.user_id;       

      if (tripDetail.trip_status != "NOT_STARTED") {
        console.log("already started");
        return res.send({
          status: 400,
          message: "This trip has been already started",
        });
      }

      if (!reqData.total_seats && reqData.trip_type != "LUGGAGE") {
        console.log("select seats");
        return res.send({
          status: 400,
          message: "Please select seats how many do you want?",
        });
      }
      console.log("working");

      // TRIP AND LUGGAGE PRICING CALCULATE
      let amount = 0;
      if (reqData.trip_type == "LUGGAGE") {
        amount = tripDetail.luggage_price;
      } else {
        amount = tripDetail.travel_price * reqData.total_seats;
      }

      reqData["status"] = "PAYMENT_PENDING";
      reqData["amount"] = amount;

      let ride = await new Rider(reqData).save();
      let ride_id = ride._id;

      // INITITAL STRIPE PAYMENT DETAILS AND REDIRECT TO STRIPE PAYMENT SCREEN
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100,
        currency: "usd",
        payment_method_types: ["card"],
        metadata: {
          trip_id: trip_id + "",
          ride_id: ride_id + "",
          name: "John Doe",
        },
      });

      const clientSecret = paymentIntent.client_secret;
      let paymentData = {
        ride_id,
        trip_id,
        amount,
        payment_intent_id: paymentIntent.id,
        currency: paymentIntent.currency,
        client_secret: clientSecret,
      };

      let stripe_payment = await StripePayment(paymentData).save();

      let stripeData = {
        stripe_payment_id: stripe_payment._id,
        ride_id: ride_id,
      };

      return res.status(200).send({
        status: 200,
        clientSecret,
        stripeData,
        message: "Payment initiated",
      });

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
    try {
      let { stripe_payment_id, ride_id, payment_status } = req.body;

      await StripePayment.updateOne(
        { _id: stripe_payment_id, ride_id },
        { $set: { payment_status } }
      );

      let status = "";
      if (payment_status == "SUCCESS") {
        status = "INTRESTED";
      } else {
        status = "PAYMENT_FAILED";
        await Rider.updateOne({ _id: ride_id }, { $set: { status } });

        return res.status(200).send({ status: 200, message: "Payment transaction failed." });
      }

      await Rider.updateOne({ _id: ride_id }, { $set: { status } });
      let ride = await Rider.findOne({ _id: ride_id }).populate(
        "user_id",
        "name"
      );

      // DEDUCT SEATS
      let tripDetail = await UserTrip.findOne({ _id: ride.trip_id });
      if (ride.trip_type != "LUGGAGE") {
        let remaining_seats = 0;
        remaining_seats = tripDetail.available_seats - ride.total_seats;
        await UserTrip.updateOne(
          { _id: ride.trip_id },
          { $set: { available_seats: remaining_seats } }
        );
      }

      // ADD AMOUNT TO DRIVER WALLET WHEN PASSENGER PAID TRIP AMOUNT
      let usersAmount = await UserLogins.findById(tripDetail.user_id);
      let amount = usersAmount.wallet_amount + ride.amount;
      await UserLogins.findByIdAndUpdate(usersAmount._id, {
        $set: { wallet_amount: amount },
      });

      // SAVE AND SEND NOTIFICATION TO DRIVER
      let passengerName = ride.user_id.name;
      let messageData = {
        user_id: tripDetail.user_id,
        message: `You have a new requested ride from a ${passengerName}.`,
        type: "MY_TRIP_DETAIL",
        reference_id: tripDetail._id,
      };
      await Notification(messageData).save();
      let notificationData = {
        user_id: tripDetail.user_id,
        message: `You have a new requested ride from a ${passengerName}.`,
      };
      await firebase.sendPushNotificationToSingleUser(notificationData);

      return res.status(200).send({ status: 200, message: "Ride successfully created..." });
    } catch (error) {
      console.log("catch error", error);
      return res.status(400).send({ status: 400, message: error.message });
    }
  },

  confirmTripTest: async (req, res, next) => {
    try {
      let reqData = req.body;
      let rider_user_id = reqData.user_id;
      let rider_name = reqData.rider_name;
      let trip_id = reqData.trip_id;

      const tripDetail = await UserTrip.findOne({ _id: trip_id });

      if (tripDetail.trip_status != "NOT_STARTED") {
        console.log("already started");
        return res.send({
          status: 400,
          message: "This trip has been already started",
        });
      }

      if (!reqData.total_seats && reqData.trip_type != "LUGGAGE") {
        console.log("select seats");
        return res.send({
          status: 400,
          message: "Please select seats how many do you want?",
        });
      }

      if (reqData.total_seats > tripDetail.available_seats) {
        return res
          .status(200)
          .send({ status: 400, message: "Seats not available." });
      }

      let amount = 0;
      if (reqData.trip_type == "LUGGAGE") {
        amount = tripDetail.luggage_price;
      } else {
        amount = tripDetail.travel_price * reqData.total_seats;
      }

      reqData["status"] = "INTRESTED";
      reqData["amount"] = amount;

      let ride = await new Rider(reqData).save();

      if (ride.trip_type != "LUGGAGE") {
        let remaining_seats = 0;
        remaining_seats = tripDetail.available_seats - ride.total_seats;
        await UserTrip.updateOne(
          { _id: trip_id },
          { $set: { available_seats: remaining_seats } }
        );
      }

      let messageData = {
        user_id: tripDetail.user_id,
        message: `You have a new requested ride from a ${rider_name}.`,
        type: "MY_TRIP_DETAIL",
        reference_id: tripDetail._id,
      };

      await Notification(messageData).save();

      let notificationData = {
        user_id: tripDetail.user_id,
        message: `You have a new requested ride from a ${rider_name}.`,
      };

      await firebase.sendPushNotificationToSingleUser(notificationData);

      console.log("completed");

      return res
        .status(200)
        .send({ status: 200, message: "Ride successfully created.." });
    } catch (e) {
      console.log("error -----------------", e);
      return res
        .status(400)
        .send({ status: 400, message: "Something went wrong in api." });
    }
  },

  acceptDeclineTrip: async (req, res, next) => {
    try {
      let { status, rider_id } = req.body;

      await Rider.updateOne({ _id: rider_id }, { status: status });
      let riderData = await Rider.findOne({ _id: rider_id });

      let messageData = {
        user_id: riderData.user_id,
        message: `Your request has been ${status.toLowerCase()}.`,
        type: "BOOKED_TRIP_DETAIL",
        reference_id: riderData.trip_id,
      };
      await Notification(messageData).save();

      status = status.toLowerCase();
      let notificationData = {
        user_id: riderData.user_id,
        message: `Your request data has been ${status}.`,
      };

      firebase.sendPushNotificationToSingleUser(notificationData);

      return res
        .status(200)
        .send({ status: 200, message: `User ride ${status} successfully` });
    } catch (error) {
      console.log("error ---------", error);
      return res.status(400).send({ status: 400, message: error.message });
    }
  },

  tripStatusUpdate: async (req, res, next) => {
    try {
      let { trip_status, trip_id, riders_id } = req.body;

      await UserTrip.updateOne({ _id: trip_id }, { trip_status: trip_status });

      if (trip_status == "FINISHED") {

        let riders = await Rider.find({
          trip_id: trip_id,
          $or: [ {status: 'PICKUP' }, {status: 'CONFIRMED' } ]
        }).select('_id');
       
        let riders_id = []
        riders.map((item) => {
          riders_id.push(item._id)
        })
 
        await Rider.updateMany(
          { _id: { $in: riders_id } },
          { status: "FINISHED" }
        );
      }

      return res.status(200).send({ status: 200, message: `Trip status updated successfully` });
    } catch (error) {
      return res.status(400).send({ status: 400, message: error.message });
    }
  },

  rideStatusUpdate: async (req, res, next) => {
    try {
      let { ride_status, ride_id } = req.body;
      console.log(req.body);

      await Rider.updateOne({ _id: ride_id }, { status: ride_status });

      return res
        .status(200)
        .send({ status: 200, message: `Ride status updated successfully` });
    } catch (error) {
      return res.status(400).send({ status: 400, message: error.message });
    }
  },

  getChatList: async (req, res, next) => {
    try {
      let { user_id } = req.body;

      const trips = await UserTrip.aggregate([
        { $match: { user_id: mongoose.Types.ObjectId(user_id) } },
        {
          $lookup: {
            from: "riders",
            localField: "_id",
            foreignField: "trip_id",
            as: "riderData",
          },
        },
        {
          $unwind: {
            path: "$riderData",
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "riderData.user_id",
            foreignField: "_id",
            as: "riderData.userDetail",
          },
        },
        {
          $unwind: {
            path: "$riderData.userDetail",
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $project: {
            _id: 1,
            "riderData._id": 1,
            "riderData.userDetail._id": 1,
            "riderData.userDetail.name": 1,
            "riderData.userDetail.avatar": 1,
            "riderData.userDetail.email": 1,
          },
        },
      ]);

      const rides = await Rider.aggregate([
        { $match: { user_id: mongoose.Types.ObjectId(user_id) } },
        {
          $lookup: {
            from: "user_trips",
            localField: "trip_id",
            foreignField: "_id",
            as: "tripDetail",
          },
        },
        {
          $unwind: {
            path: "$tripDetail",
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "tripDetail.user_id",
            foreignField: "_id",
            as: "tripDetail.userDetail",
          },
        },
        {
          $project: {
            _id: 1,
            "tripDetail.userDetail._id": 1,
            "tripDetail.userDetail.name": 1,
            "tripDetail.userDetail.avatar": 1,
            "tripDetail.userDetail.email": 1,
          },
        },
      ]);

      let chatData = [];
      trips.map((item) => {
        chatData.push(item.riderData.userDetail);
      });

      rides.map((item) => {
        chatData.push(item.tripDetail.userDetail[0]);
      });

      function removeDuplicates(originalArray, prop) {
        var newArray = [];
        var lookupObject = {};

        for (var i in originalArray) {
          lookupObject[originalArray[i][prop]] = originalArray[i];
        }

        for (i in lookupObject) {
          newArray.push(lookupObject[i]);
        }
        return newArray;
      }

      var uniqueArray = removeDuplicates(chatData, "email");

      return res.status(200).send({
        status: 200,
        length: uniqueArray.length,
        chats: uniqueArray,
        message: `Chat list get successfully`,
      });
    } catch (error) {
      return res.status(400).send({ status: 400, message: error.message });
    }
  },

  deleteCar: async (req, res, next) => {
    try {
      const reqQuery = req.query;
      const slug = reqQuery.slug;

      if (!slug) {
        return res.send({ status: 400, message: "_id is required" });
      }
      const deleted = await Car.findOneAndRemove({ _id: slug }).lean().exec();

      if (!deleted) {
        return res.send({ status: 400, message: "Car not found" });
      }
      return res.send({ status: 200, message: "Car deleted successfully" });
    } catch (error) {
      return res.send({ status: 400, message: error.message });
    }
  },

  getCars: async (req, res, next) => {
    try {
      const cars = await Car.find();
      if (cars.length === 0) {
        return res.send({ status: 400, message: "cars not found" });
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
      const AllPages = await Car.find()
        .sort({ updated_at: -1 })
        .skip(Limit * PageNo)
        .limit(Limit)
        .lean()
        .exec();
      const count = await Car.count();
      return res.send({
        status: true,
        data: AllPages,
        count: count,
        message: "All Page get successfully",
      });
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
      const status = isActive === "" ? false : true;

      const data = {
        car_id,
        car_model,
        isAction: status,
      };
      let findModal = await CarModel.find({ car_model });

      if (findModal.length > 0) {
        res.send({ status: 400, message: "This Car Modal is already exits" });
        return false;
      }

      const carModel = new CarModel(data);
      const created = await carModel.save();
      return res.send({
        status: 200,
        message: "Car Model created successfully",
      });
    } catch (error) {
      return res.send({ status: 400, message: error.message });
    }
  },

  updateCarModel: async (req, res, next) => {
    try {
      const reqBody = req.body;
      const Id = reqBody._id;
      reqBody.isActive = reqBody.isActive === "" ? false : true;

      let findCarModel = await CarModel.find({
        _id: { $ne: Id },
        car_model: reqBody.car_model,
      });
      if (findCarModel.length > 0) {
        res.send({ status: 400, message: "Car Model Already Exits" });
        return false;
      }
      await CarModel.findByIdAndUpdate(Id, reqBody).lean().exec();
      return res.send({
        status: 200,
        message: "Car Model updated successfully",
      });
    } catch (error) {
      return res.send({ status: 400, message: error.message });
    }
  },

  getCarModel: async (req, res, next) => {
    try {
      const { car_id } = req.body;
      const carModels = await CarModel.find({ car_id });
      if (carModels.length === 0) {
        return res.send({ status: 400, message: "car models not found" });
      }
      return res.send({
        status: 200,
        data: carModels,
        message: "Car modal get successfully",
      });
    } catch (error) {
      return res.send({ status: 400, message: error.message });
    }
  },

  getAllCarModels: async (req, res, next) => {
    try {
      const reqBody = req.body;
      const Limit = reqBody.limit ? parseInt(reqBody.limit) : 10;
      const PageNo = reqBody.page ? parseInt(reqBody.page) : 0;
      const AllPages = await CarModel.find()
        .sort({ updated_at: -1 })
        .skip(Limit * PageNo)
        .limit(Limit)
        .lean()
        .exec();
      const count = await CarModel.count();
      return res.send({
        status: true,
        data: AllPages,
        count: count,
        message: "Car Model get successfully",
      });
    } catch (error) {
      return res.send({ status: false, message: error.message });
    }
  },

  deleteCarModel: async (req, res, next) => {
    try {
      const reqQuery = req.query;
      const slug = reqQuery.slug;

      if (!slug) {
        return res.send({ status: 400, message: "_id is required" });
      }
      const deleted = await CarModel.findOneAndRemove({ _id: slug })
        .lean()
        .exec();

      if (!deleted) {
        return res.send({ status: 400, message: "Car Model not found" });
      }
      return res.send({
        status: 200,
        message: "Car Model deleted successfully",
      });
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
      const status = isActive === "" ? false : true;
      const data = {
        title,
        isActive: status,
      };
      let findColor = await Color.find({ title });

      if (findColor.length > 0) {
        res.send({ status: 400, message: "Color Already Exits" });
        return false;
      }

      const Colors = new Color(data);
      const created = await Colors.save();
      return res.send({
        status: 200,
        message: "Car Color created successfully",
      });
    } catch (error) {
      return res.send({ status: 400, message: error.message });
    }
  },

  updateColor: async (req, res, next) => {
    try {
      const reqBody = req.body;
      const Id = reqBody._id;

      reqBody.isActive = reqBody.isActive === "" ? false : true;

      let findColor = await Color.find({
        _id: { $ne: Id },
        title: reqBody.title,
      });

      if (findColor.length > 0) {
        res.send({ status: 400, message: "Color Already Exits" });
        return false;
      }

      if (!Id) {
        return res.send({ status: 400, message: "Id is required" });
      }
      await Color.findByIdAndUpdate(Id, reqBody).lean().exec();
      return res.send({ status: 200, message: "Color updated successfully" });
    } catch (error) {
      return res.send({ status: 400, message: error.message });
    }
  },

  deleteColor: async (req, res, next) => {
    try {
      const reqQuery = req.query;
      const slug = reqQuery.slug;

      if (!slug) {
        return res.send({ status: 400, message: "_id is required" });
      }
      const deleted = await Color.findOneAndRemove({ _id: slug }).lean().exec();

      if (!deleted) {
        return res.send({ status: 400, message: "Color not found" });
      }
      return res.send({ status: 200, message: "Color deleted successfully" });
    } catch (error) {
      return res.send({ status: 400, message: error.message });
    }
  },

  getColor: async (req, res, next) => {
    try {
      const colors = await Color.find();
      if (colors.length === 0) {
        return res.send({ status: 400, message: "colors not found" });
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
      const AllPages = await Color.find()
        .sort({ updated_at: -1 })
        .skip(Limit * PageNo)
        .limit(Limit)
        .lean()
        .exec();
      const count = await Color.count();
      return res.send({
        status: true,
        data: AllPages,
        count: count,
        message: "All Page get successfully",
      });
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
      const status = isActive === "" ? false : true;
      const data = {
        title,
        isActive: status,
      };

      let findCarType = await CarType.find({ title });

      if (findCarType.length > 0) {
        res.send({ status: 400, message: "Car Type Already Exits" });
        return false;
      }

      const CarTypes = new CarType(data);
      const created = await CarTypes.save();
      return res.send({
        status: 200,
        message: "Car Type created successfully",
      });
    } catch (error) {
      return res.send({ status: 400, message: error.message });
    }
  },

  updateCarType: async (req, res, next) => {
    try {
      const reqBody = req.body;
      const Id = reqBody._id;
      reqBody.isActive = reqBody.isActive === "" ? false : true;
      let findCarType = await CarType.find({
        _id: { $ne: Id },
        title: reqBody.title,
      });

      if (findCarType.length > 0) {
        res.send({ status: 400, message: "Car type Already Exits" });
        return false;
      }

      if (!Id) {
        return res.send({ status: 400, message: "Id is required" });
      }
      await CarType.findByIdAndUpdate(Id, reqBody).lean().exec();
      return res.send({
        status: 200,
        message: "Car type updated successfully",
      });
    } catch (error) {
      return res.send({ status: 400, message: error.message });
    }
  },

  withdrawRequest: async (req, res, next) => {
    try {
      const withdrawRequest = new WithdrawRequest(req.body);
      const created = await withdrawRequest.save();
      return res.send({
        status: 200,
        message: "request generated successfully.",
      });
    } catch (error) {
      return res.send({ status: 400, message: error.message });
    }
  },

  withdrawList: async (req, res, next) => {
    try {
      const reqBody = req.body;
      const Limit = reqBody.limit ? parseInt(reqBody.limit) : 10;
      const PageNo = reqBody.page ? parseInt(reqBody.page) : 0;
      const withdrawRequests = await WithdrawRequest.find()
        .sort({ updated_at: -1 })
        .skip(Limit * PageNo)
        .limit(Limit)
        .lean()
        .populate("user_id")
        .exec();
      const count = await WithdrawRequest.count();
      return res.send({
        status: true,
        data: withdrawRequests,
        count: count,
        message: "All withdraw request get successfully",
      });
    } catch (error) {
      return res.send({ status: false, message: error.message });
    }
  },

  withdrawDetail: async (req, res, next) => {
    try {
      const reqQuery = req.query;
      const slug = reqQuery.slug;
      const withRequest = await WithdrawRequest.find({ _id: slug })
        .lean()
        .exec();
      return res.send({ status: 200, data: withRequest });
    } catch (error) {
      return res.send({ status: 400, message: error.message });
    }
  },

  deleteCarType: async (req, res, next) => {
    try {
      const reqQuery = req.query;
      const slug = reqQuery.slug;

      if (!slug) {
        return res.send({ status: 400, message: "_id is required" });
      }
      const deleted = await CarType.findOneAndRemove({ _id: slug })
        .lean()
        .exec();

      if (!deleted) {
        return res.send({ status: 400, message: "Color not found" });
      }
      return res.send({
        status: 200,
        message: "Car Type deleted successfully",
      });
    } catch (error) {
      return res.send({ status: 400, message: error.message });
    }
  },

  getCarType: async (req, res, next) => {
    try {
      const carTypes = await CarType.find();
      if (carTypes.length === 0) {
        return res.send({ status: 400, message: "cars not found" });
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
      const AllPages = await CarType.find()
        .sort({ updated_at: -1 })
        .skip(Limit * PageNo)
        .limit(Limit)
        .lean()
        .exec();
      const count = await CarType.count();
      return res.send({
        status: true,
        data: AllPages,
        count: count,
        message: "All Page get successfully",
      });
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

  getTripByDate: async (req, res, next) => {
    const reqBody = req.body;

    // let date = new Date().toISOString().slice(0, 10);
    let userId = mongoose.Types.ObjectId(reqBody.user_id);
    UserTrip.findOne(
      {
        $and: [
          {
            user_id: userId,
          },
          {
            date_of_departure: {
              $gte: `${reqBody.dateString}T00:00:00.000Z`,
              $lte: `${reqBody.dateString}T23:59:59.999Z`,
            },
          },
        ],
      },
      function (err, trip) {
        if (err) {
          return res.status(400).send({ message: err.message });
        }

        //console.log(trips);
        return res.status(200).send({ data: trip });
      }
    );
  },

  getAllTripByDate: async (req, res, next) => {
    const reqBody = req.body;
    console.log("req_body", reqBody);
    let date = new Date().toISOString().slice(0, 10);
    let userId = mongoose.Types.ObjectId(reqBody.user_id);
    UserTrip.find(
      {
        $and: [
          {
            user_id: userId,
          },
          {
            date_of_departure: {
              $gte: `${date}T00:00:00.000Z`,
              //$lte: `${reqBody.dateString}T23:59:59.999Z`
            },
          },
        ],
      },
      function (err, trips) {
        if (err) {
          return res.status(400).send({ message: err.message });
        }

        return res.status(200).send({ data: trips });
      }
    );
  },
};
