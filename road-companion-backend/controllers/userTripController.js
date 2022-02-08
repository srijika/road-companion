const { UserTrip, UserVehicle } = require('../_helper/db');
var path = require('path');
var fs = require('fs');
const mongoose = require('mongoose');
const aws = require('aws-sdk');
const S3image_url = 'https://choovoo-test.s3.ap-south-1.amazonaws.com/';

aws.config.update({
    secretAccessKey: 'aoSbNdNF3K2+z31gGJX31RuKTNijkfPWwRxymHAV',
    accessKeyId: 'AKIAXRCHJ4CSM5C36R77',
    region: 'ap-south-1'
});
const s3Bucket = new aws.S3({ params: { Bucket: 'choovoo-test' } });

module.exports = {


    //---------------- Functions for trips modules -------------//

    createTrip: async (req, res, next) => {

        try {
            let license = '';

            console.log(req.body);
            console.log('req.body working');
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

            console.log('obj');
            console.log(obj);

            const Trip = new UserTrip(obj);
            await Trip.save();
            console.log('working');
            return res.status(200).send({ status: 200, message: 'Trip created successfully' });
        } catch (error) {
            return res.status(400).send({ status: 400, message: error.message });
        }

    },


    getTrips: async (req, res, next) => {
        try {
            let user_id = req.body.user_id;
            console.log('working');
            console.log(user_id);
            let trips = await UserTrip.find({ user_id: user_id });
            console.log('trips');
            return res.status(200).send({ status: 400, data: trips, message: "trips get successfully" });
        } catch (e) {
            console.log(e);
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

     nearBytrip:async (req, res, next) => {
         const {date,fromLatt,fromLong,fromCity,toCity} = req.body ;
          UserTrip.find({$and:[{from_location: {
             $near: {
                 $maxDistance: 25000,
                 $geometry: {
                     type: "Point",
                     coordinates: [fromLatt, fromLong]
                    }
                }
            }},{date_of_departure:{
                $gte: `${date}T00:00:00.000Z`, 
                $lt: `${date}T23:59:59.999Z`
            }},{from_city:fromCity,to_city:toCity}]}, function(err, trips) 
            {
               if (err)
               {
                   return res.status(400).send({message: err.message });
               }
                console.log(trips) ;
               return res.status(200).send({data: trips });
            }).populate('user_id');
        
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
            console.log(slug);
            const cars = await Car.find({ _id: slug }).lean().exec();
            console.log(cars);
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
