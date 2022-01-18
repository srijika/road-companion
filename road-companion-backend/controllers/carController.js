const { Car,CarModel,Color,CarType } = require('../_helper/db');
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
    
    
    //---------------- Functions for cars modules -------------//

    createCar: async (req, res, next) => {
        
        try {
            const { brand_name ,isActive } = req.body;
            const status =   isActive === '' ? false : true  ;   
            const data = {
                brand_name,
                isActive:status
            }
             let findCar = await Car.find({ brand_name }) ; 
             
             if (findCar.length > 0) {
                 res.send({ status: 400, message: "Car Already Exits" });
                 return false;
             }

            const Cars = new Car(data);
            const created = await Cars.save();
            return res.send({ status: 200, message: 'Car created successfully' });
        } catch (error) {
            return res.send({ status: 400, message: error.message });
        }
    },
    
    updateCar: async (req, res, next) => {
        try {
            const reqBody = req.body;
            const carId = reqBody._id;
            reqBody.isActive = reqBody.isActive === '' ? false : true ;
            
            let findCar = await Car.find({ _id: { $ne: carId }, brand_name: reqBody.brand_name });
            
            if (findCar.length > 0) {
                res.send({ status: 400, message: "Car Already Exits" });
                return false;
            }

            if (!carId) {
                return res.send({ status: 400, message: 'Id is required' });
            }
            await Car.findByIdAndUpdate(carId, reqBody).lean().exec();

            return res.send({ status: 200, message: 'Car updated successfully' });

        } catch (error) {
            return res.send({ status: 400, message: error.message });
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
            const cars = await Car.find() ;
            if (cars.length === 0) {
                return res.send({ status: 400, message: 'cars not found'});
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
            console.log(slug) ;
            const cars = await Car.find({_id: slug}).lean().exec();
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
            const { car_id, car_model ,isActive } = req.body;
            const status =   isActive === '' ? false : true  ;   
            
            const data = {
                car_id,
                car_model,
                isAction:status
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
            const Id = reqBody._id ;
            reqBody.isActive = reqBody.isActive === '' ? false : true ;
            
            let findCarModel = await CarModel.find({ _id: { $ne:Id }, car_model: reqBody.car_model });
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
            const { car_id} = req.body;
            const carModels = await CarModel.find({ car_id }) ;
            if (carModels.length === 0) {
                return res.send({ status: 400, message: 'car models not found'});
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
            const deleted = await CarModel.findOneAndRemove({ _id:slug }).lean().exec();

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
            const cars = await CarModel.find({_id: slug}).lean().exec();
            return res.send({ status: 200, data: cars });

        } catch (error) {
            return res.send({ status: 400, message: error.message });
        }
    },

    //-------------------------END--------------------//
    //---------------- Functions for cars colors  -------------//
    
    createColor: async (req, res, next) => {
        
        try {
            const { title,isActive } = req.body;
            const status =   isActive === '' ? false : true  ;   
            const data = {
                title,
                isActive : status
            }
             let findColor = await Color.find({ title }) ; 
             
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
          
            reqBody.isActive = reqBody.isActive === '' ? false : true ;
           
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
            const colors = await Color.find() ;
            if (colors.length === 0) {
                return res.send({ status: 400, message: 'colors not found'});
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
            const colors = await Color.find({_id: slug}).lean().exec();
            return res.send({ status: 200, data: colors });

        } catch (error) {
            return res.send({ status: 400, message: error.message });
        }
    },
    
    //-------------------------END--------------------//
    //---------------- Functions for cars type  -------------//

    createCarType: async (req, res, next) => {
        
        try {
            const { title,isActive } = req.body;
            const status =   isActive === '' ? false : true  ;   
            const data = {
                title,
                isActive :  status
            }   
            
             let findCarType = await CarType.find({ title }) ; 
             
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
            const carTypes = await CarType.find() ;
            if (carTypes.length === 0) {
                return res.send({ status: 400, message: 'cars not found'});
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
            const carTypes = await CarType.find({_id: slug}).lean().exec();
            return res.send({ status: 200, data: carTypes });

        } catch (error) {
            return res.send({ status: 400, message: error.message });
        }
    },
     
    
     




}
