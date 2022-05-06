const { Car, CarModel, Color, CarType } = require("../_helper/db");
var path = require("path");
var fs = require("fs");
const mongoose = require("mongoose");
const aws = require("aws-sdk");
const S3image_url = "https://choovoo-test.s3.ap-south-1.amazonaws.com/";

aws.config.update({
  secretAccessKey: "aoSbNdNF3K2+z31gGJX31RuKTNijkfPWwRxymHAV",
  accessKeyId: "AKIAXRCHJ4CSM5C36R77",
  region: "ap-south-1",
});
const s3Bucket = new aws.S3({ params: { Bucket: "choovoo-test" } });

module.exports = {
  //---------------- Functions for cars modules -------------//

  createCar: async (req, res, next) => {
    try {
      const { brand_name, type_id } = req.body;
    
      let findCar = await Car.find({ brand_name, type_id });
      
      if (findCar.length > 0) {
        return res.send({ status: 400, message: "Car already exits." });
      }
   
      await Car(req.body).save();

      return res.status(200).send({ status: 200, message: "Car created successfully" });
    } catch (error) {
      console.log('catch error', error)
      return res.status(400).send({ status: 400, message: error.message });
    }
  },

  updateCar: async (req, res, next) => {
    try {
      const reqBody = req.body;
      const carId = reqBody._id;
      reqBody.isActive = reqBody.isActive === "" ? false : true;

      let findCar = await Car.find({
        _id: { $ne: carId },
        brand_name: reqBody.brand_name,
      });

      if (findCar.length > 0) {
        res.send({ status: 400, message: "Car Already Exits" });
        return false;
      }

      if (!carId) {
        return res.send({ status: 400, message: "Id is required" });
      }
      await Car.findByIdAndUpdate(carId, reqBody).lean().exec();

      return res.send({ status: 200, message: "Car updated successfully" });
    } catch (error) {
      return res.send({ status: 400, message: error.message });
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

  uploadData: async (req, res, next) => {
    let d = Object.entries(data.results);

    const types = [];
    d.map((item) => {
      let d = {
        category_type: item[1].Category,
        make_brand_name: item[1].Make,
        model: item[1].Model,
        status: true,
      };
      if (types.includes(item[1].Category) === false) {
        types.push(d);
      }
    });

    console.log("dgkljdf");
    console.log(types);

    let modals = await Promise.all(
      types.map(async (item) => {
        let carType = await Car.findOne({ brand_name: item.make_brand_name });

        if (carType) {
          let data = {
            car_model: item.model,
            car_id: carType._id,
            status: true,
          };
          // Car().save();

          if (data != undefined) {
            return data;
          }
        }
      })
    );

    console.log(modals);

    // await CarModel.insertMany(modals);

    console.log("car data uploaded modals");
    // let makes = [];
    //  let makes = await Promise.all(types.map(async (item) => {

    //     let carType = await CarType.findOne({ title: item.category_type });

    //     if(carType) {
    //         let data = {
    //             brand_name: item.make_brand_name,
    //             type_id: carType._id
    //         }
    //         // Car().save();

    //         if(data != undefined) {
    //             return data;
    //         }

    //     }
    // }))

    let filterMake = makes.filter(function (element) {
      return element !== undefined;
    });

    //     function removeDuplicates(originalArray, prop) {
    //         var newArray = [];
    //         var lookupObject  = {};
    //         for(var i in originalArray) {
    //            lookupObject[originalArray[i][prop]] = originalArray[i];
    //         }
    //         for(i in lookupObject) {
    //             newArray.push(lookupObject[i]);
    //         }
    //          return newArray;
    //     }

    //    var uniqueArray = removeDuplicates(filterMake, "brand_name");

    //    await Car.insertMany(uniqueArray);
  },

  getCars: async (req, res, next) => {
    try {
      let type_id = req.body.type_id;

      const cars = await Car.find({ type_id: type_id });
      if (cars.length === 0) {
        return res.send({ status: 400, message: "Make not found" });
      }
      return res.send({ status: 200, data: cars });
    } catch (error) {
      return res.send({ status: 400, message: error.message });
    }
  },

  getAllCars: async (req, res, next) => {
    try {
      const reqBody = req.body;

      console.log('reqBody')
      console.log(reqBody)

      const Limit = reqBody.limit ? parseInt(reqBody.limit) : 10;
      const PageNo = reqBody.page ? parseInt(reqBody.page) : 0;
      const AllPages = await Car.find().sort({ updated_at: -1 }).skip(Limit * PageNo).limit(Limit).populate('type_id', 'title');
      const count = await Car.count();
      return res.status(200).send({ status: true, data: AllPages, count: count, message: "All Page get successfully", });
    } catch (error) {
      return res.status(400).send({ status: false, message: error.message });
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
      const status = isActive === "" ? false : true;

      const data = { car_id, car_model, isActive: status };
      let findModal = await CarModel.find({ car_model });

      if (findModal.length > 0) {
        res.send({ status: 400, message: "This Car Modal is already exits" });
        return false;
      }

      await CarModel(data).save();
      
      return res.send({ status: 200, message: "Car Model created successfully"});
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

      console.log("car_id--------", car_id);

      const carModels = await CarModel.find({ car_id: car_id });

      console.log("carModels");
      console.log(carModels);

      if (carModels.length === 0) {
        return res.send({ status: 400, message: "Car models not found" });
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
        .populate("car_id")
        .lean()
        .exec();
      console.log(AllPages);
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
      const carTypes = await CarType.find({}).select('title');
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

      let types = await Promise.all(
        AllPages.map(async (item) => {
          let data = await Car.find({ type_id: item._id });
          if (data.length > 0) {
            return item;
          }
        })
      );

      types = types.filter(function (element) {
        return element !== undefined;
      });

      return res.send({
        status: true,
        data: types,
        count: types.length,
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
};

// var express = require('express');
// var mongoose = require('mongoose');
// var multer = require('multer');
// var path = require('path');
// var userModel = require('./models/userModel');
// var excelToJson = require('convert-excel-to-json');
// var bodyParser = require('body-parser');
// var storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, './public/uploads');
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.originalname);
//     }
// });
// var uploads = multer({ storage: storage });
// //connect to db
// mongoose.connect('mongodb://localhost:27017/exceldemo', { useNewUrlParser: true })
//     .then(() => console.log('connected to db'))
//     .catch((err) => console.log(err))
// //init app
// var app = express();
// //set the template engine
// app.set('view engine', 'ejs');
// //fetch data from the request
// app.use(bodyParser.urlencoded({ extended: false }));
// //static folder
// app.use(express.static(path.resolve(__dirname, 'public')));
// //route for Home page
// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/index.html');
// });
// // Upload excel file and import to mongodb
// app.post('/uploadfile', upload.single("uploadfile"), (req, res) => {
//     importExcelData2MongoDB(__dirname + '/uploads/' + req.file.filename);
//     console.log(res);
// });
// // Import Excel File to MongoDB database
// function importExcelData2MongoDB(filePath) {
//     // -> Read Excel File to Json Data
//     const excelData = excelToJson({
//         sourceFile: filePath,
//         sheets: [{
//             // Excel Sheet Name
//             name: 'Customers',
//             // Header Row -> be skipped and will not be present at our result object.
//             header: {
//                 rows: 1
//             },
//             // Mapping columns to keys
//             columnToKey: {
//                 A: '_id',
//                 B: 'name',
//                 C: 'address',
//                 D: 'age'
//             }
//         }]
//     });
//     // -> Log Excel Data to Console
//     console.log(excelData);

//     userModel.insertMany(jsonObj, (err, data) => {
//         if (err) {
//             console.log(err);
//         } else {
//             res.redirect('/');
//         }
//     });
//     fs.unlinkSync(filePath);
// }
// //assign port
// var port = process.env.PORT || 3000;
// app.listen(port, () => console.log('server run at port ' + port));
