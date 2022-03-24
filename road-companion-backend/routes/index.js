require("dotenv").config();
var express = require("express");
var app = express();
var authCtrl = require("../controllers/authController");

const jwt = require("jsonwebtoken");
var cors = require("cors");
const accessTokenSecret = require("../config.json").jwd_secret;
var path = require("path");
var multer = require("multer");

const Path = require("path");
const fs = require("fs");

const userBackgroundController = require("../controllers/userBackgroundController");

const carController = require("../controllers/carController");
const UserTripController = require("../controllers/userTripController");
const reviewController = require("../controllers/reviewController");
const tagController = require("../controllers/tagController");
const reportController = require("../controllers/reportController");
const notificationController = require("../controllers/notification.controller");

const adminController = require("../controllers/adminController");
const htmlPagesController = require("../controllers/htmlPagesController");
const frequentlyAskedQuestion = require("../controllers/frequentlyAskedQuestion");

const settingController = require("../controllers/setting.controller");

const multerS3 = require("multer-s3");
const aws = require("aws-sdk");

// chovoo bucket keys
// aws.config.update({
//   secretAccessKey: 'aoSbNdNF3K2+z31gGJX31RuKTNijkfPWwRxymHAV',
//   accessKeyId: 'AKIAXRCHJ4CSM5C36R77',
//   region: 'ap-south-1'
// });

// aws.config.update({
//   secretAccessKey: 'UAPoCUVPmAqL34In8V/VFSy9q+YvMEYHMBTF/qAI',
//   accessKeyId: 'AKIAZ32E2PNKQB5J64NP',
//   region: 'us-east-1'
// });

// Wavess3 bucket
// aws.config.update({
//   secretAccessKey: 'oFJNCMa7wCCIOLh7WMxSRwPB3CufNgk3SVXvHmcM',
//   accessKeyId: 'AKIAZ32E2PNK67MEH4GM',
//   region: 'us-east-1'
// });
const bucketName = process.env.S3_BUCKET_NAME;

aws.config.update({
  secretAccessKey: process.env.S3_BUCKET_SECRET_ACCESS_KEY,
  accessKeyId: process.env.S3_BUCKET_ACCESS_KEY_ID,
  region: "us-east-2",
});

const s3 = new aws.S3();
const upload = multer({
  storage: multerS3({
    s3: s3,
    // bucket: 'choovoo-test',
    bucket: bucketName,
    key: function (req, file, cb) {
      const str = file.originalname;
      const extension = str.substr(str.lastIndexOf("."));
      const fileName =
        Date.now() +
        "" +
        Math.round(Math.round(Math.random() * 5000)) +
        "" +
        extension;
      cb(null, "public_asset/" + fileName);
    },
  }),
});

const deleteFilesFromS3 = (image) => {
  //  let image = 'public_asset/16472433016711419.jpg';
  const params = {
    Bucket: bucketName,
    Key: image,
  };

  s3.deleteObject(params, (err, data) => {
    if (error) {
      res.status(500).send(error);
    }
    res.status(200).send("File has been deleted successfully");
  });
};

var routefunctions = (app) => {
  app.use(cors());

  //All Users API checking prefix
  app.post("/api/send-otp", authCtrl.sendOtp);
  app.post("/api/signup", authCtrl.signup);
  app.post("/api/user/login", authCtrl.loginUser);
  app.post("/api/user/resetPassword", authCtrl.recoverPasswordUser);
  app.post("/api/resetPassword/mobile", authCtrl.forgotpasswordmobile);
  app.get("/api/resetPasswordView/mobile", authCtrl.recoverpasswordmobileview);
  app.post("/api/recoverPassword/mobile", authCtrl.recoverpasswordfrommobile);
  app.post("/api/getprofile", authenticateJWT, authCtrl.getprofile);
  app.post("/api/get-user-detail", authenticateJWT, authCtrl.getUserDetail);

  app.post("/api/verify/otp", authCtrl.verifyOtp);
  app.post("/api/login", authCtrl.login);
  app.post("/api/forgetpassword", authCtrl.forgotpassword);

  app.post("/api/resetPassword", authCtrl.recoverpassword);

  // friend requests

  // ----- For car modules apis -----//
  app.post("/api/create-car", carController.createCar);
  app.post("/api/update-car", carController.updateCar);
  app.post("/api/delete-car", carController.deleteCar);
  app.post("/api/getall-cars", carController.getAllCars);
  app.post("/api/get-cars", carController.getCars);
  app.get("/api/get-car-detail", carController.getCarDetail);
  

  // ----- For car models modules apis -----//
  app.post("/api/create-car-model", carController.createCarModel);
  app.post("/api/update-car-model", carController.updateCarModel);
  app.post("/api/delete-car-model", carController.deleteCarModel);
  app.post("/api/getall-car-model", carController.getAllCarModels);
  app.get("/api/get-car-model-detail", carController.getCarModelDetail);
  app.post("/api/get-cars-model", carController.getCarModel);

  // ----- For car type modules apis -----//

  app.post("/api/create-car-type", carController.createCarType);
  app.post("/api/update-car-type", carController.updateCarType);
  app.post("/api/delete-car-type", carController.deleteCarType);
  app.post("/api/getall-car-type", carController.getAllCarType);
  app.post("/api/get-cars-type", carController.getCarType);
  app.get("/api/get-car-type-detail", carController.getCarType);
  

  // ----- For car color modules apis -----//

  app.post("/api/create-car-color", carController.createColor);
  app.post("/api/update-car-color", carController.updateColor);
  app.post("/api/delete-car-color", carController.deleteColor);
  app.post("/api/getall-car-color", carController.getAllColor);
  app.post("/api/get-cars-color", carController.getColor);
  app.get("/api/get-car-color-detail", carController.getColorDetail);
  

  // for add and edit user vehicle
  app.post("/api/add-vehicle", upload.any(), authCtrl.addVehicle);

  app.post("/api/edit-vehicle", upload.any(), authCtrl.updateVehicle);

  // app.post("/api/edit-vehicle",
  //   [{
  //     name: 'insurance_certificate', maxCount: 1
  //   }, {
  //     name: 'images', maxCount: 1
  //   }]
  //   , authCtrl.updateVehicle);
  app.post("/api/delete-vehicle-image", authCtrl.deleteVehicleImage);
  app.post("/api/get-vehicle", authCtrl.getVehicle);

  //trips moudle routes
  app.post("/api/add-trip", upload.any(), UserTripController.createTrip);
  app.post("/api/update-trip", upload.any(), UserTripController.updateTrip);
  app.post("/api/nearby-trips", UserTripController.nearBytrip);
  // app.post("/api/trip-detail", upload.any(),UserTripController.nearBytrip); 
  // app.post("/api/send-request", upload.any(),UserTripController.nearBytrip); 
  // app.post("/api/accept-decline-request", upload.any(),UserTripController.nearBytrip); 
  // app.post("/api/my-trips", upload.any(),UserTripController.nearBytrip); 

  app.post("/api/initiate-trip-payment", UserTripController.initiateTripPayment);
  app.post("/api/confirm-trip", UserTripController.tripPayment);
  app.post("/api/confirm-trip/test", UserTripController.confirmTripTest);

  app.post("/api/trip-status-update", UserTripController.tripStatusUpdate);
  app.post("/api/ride-status-update", UserTripController.rideStatusUpdate);

  //trips moudle routes

  // app.post("/api/add-trip", upload.any(),UserTripController.createTrip);
  // app.post("/api/update-trip", upload.any(),UserTripController.updateTrip);
  // app.post("/api/nearby-trips", upload.any(),UserTripController.nearBytrip);
  // app.post("/api/trip-detail", upload.any(),UserTripController.tripDetail);
  // app.post("/api/send-request", upload.any(),UserTripController.sendRequest);
  // app.post("/api/accept-decline-request", upload.any(),UserTripController.acceptDeclineRequest);
  // app.post("/api/my-trips", upload.any(),UserTripController.myTrips);

  app.post("/api/get-trips", UserTripController.getTrips);
  app.post("/api/nearby-trip-detail", UserTripController.nearBytripDetail);
  app.post("/api/get-trips-by-date", UserTripController.getTripByDate);
  app.post("/api/get-all-trips-by-date", UserTripController.getAllTripByDate);

  app.post("/api/booked-trip-detail", UserTripController.tripDetail);
  app.post("/api/accept-decline-trip", UserTripController.acceptDeclineTrip);

  app.post(
    "/api/add-background",
    upload.any(),
    userBackgroundController.addBackground
  );
  app.post("/api/get-background", userBackgroundController.getBackground);

  //Shop REVIEW API
  app.post("/api/add-review", reviewController.addReview);
  app.put("/api/update-review", reviewController.updateReview);
  app.delete("/api/delete-review", reviewController.deleteReview);
  app.get("/api/review-list", reviewController.getDriverReview);
  app.post("/api/review-status", reviewController.reviewStatus);
  app.get("/api/review-detail", reviewController.reviewDetail);

  //Tag API
  app.post("/api/create/tag", authenticateJWT, tagController.createTag);
  app.post("/api/update/tag", authenticateJWT, tagController.updateTag);
  app.post("/api/delete/tag", authenticateJWT, tagController.deleteTag);
  app.post(
    "/api/getAll/tag-list",
    authenticateJWT,
    tagController.getAllTagList
  );
  app.get("/api/get/tag-list", authenticateJWT, tagController.getTagList);

  //User Services Tags
  app.post(
    "/api/create/service-tag",
    authenticateJWT,
    tagController.createServiceTag
  );
  app.post(
    "/api/update/service-tag",
    authenticateJWT,
    tagController.updateServiceTag
  );
  app.post(
    "/api/delete/service-tag",
    authenticateJWT,
    tagController.deleteServiceTag
  );
  app.post(
    "/api/get/user/service-tag",
    authenticateJWT,
    tagController.getUserServiceTag
  );

  //User Post Reporting
  app.post(
    "/api/create/post-report",
    authenticateJWT,
    reportController.createPostReport
  );
  app.post(
    "/api/delete/post-report",
    authenticateJWT,
    reportController.deletePostReport
  );
  app.post(
    "/api/get/user/report-list",
    authenticateJWT,
    reportController.getUserPostReport
  );
  app.post(
    "/api/get/report-list",
    authenticateJWT,
    reportController.getAllPostReport
  );

  //Dashboard API
  app.post("/api/dashboard", authenticateJWT, adminController.dashBoard);

  // Statcic Page Managment API
  app.post(
    "/api/create-html-pages",
    authenticateJWT,
    htmlPagesController.createHtmlPages
  );
  app.put(
    "/api/update-html-pages",
    authenticateJWT,
    htmlPagesController.updateHtmlPages
  );
  app.get("/api/get-html-pages", htmlPagesController.getHtmlPages);
  app.post("/api/getAll-html-pages", htmlPagesController.getAllHtmlPages);
  app.delete(
    "/api/delete-html-pages",
    authenticateJWT,
    htmlPagesController.deleteHtmlPages
  );
  app.put(
    "/api/status-update-html-pages",
    authenticateJWT,
    htmlPagesController.statusUpdate
  );

  // FAQ API
  app.post(
    "/api/create-frequently-asked-question",
    authenticateJWT,
    frequentlyAskedQuestion.createFrequentlyAskedAuestion
  );
  app.get(
    "/api/get-frequently-asked-questionlist",
    authenticateJWT,
    frequentlyAskedQuestion.getFrequentlyAskedAuestionList
  );
  app.get(
    "/api/get-frequently-asked-question-by-userid",
    authenticateJWT,
    frequentlyAskedQuestion.getFrequentlyAskedAuestionId
  );
  app.put(
    "/api/update-frequently-asked-question",
    frequentlyAskedQuestion.updateFrequentlyAskedQuestion
  );
  app.delete(
    "/api/delete-frequently-asked-question",
    frequentlyAskedQuestion.deleteFrequentlyAskedQuestion
  );

  // Side Setting API
  app.post("/api/list/setting", settingController.list);
  app.post("/api/create/setting", settingController.create);
  app.post("/api/edit/:id/setting", settingController.edit);
  app.post("/api/update/:id/setting", settingController.update);
  // app.post('/delete/:id/setting', settingController.delete);

  // app.post('/login', authCtrl.login)
  app.post("/api/user-active", authCtrl.userActive);

  app.post("/api/social/login", authCtrl.socialLogin);
  app.post("/api/deleteuser", authCtrl.deleteuser);

  // USER CUSTOMER APIS
  app.post("/api/send/otp/customer", authCtrl.sendOtpCustomer);
  app.post("/api/verify/otp/customer", authCtrl.verifyOTPCustomer);

  app.post("/api/upload/file", upload.any(), async (req, res, next) => {
    // res.send({ files: req.files.map(i => i.filename) })
    res.end();
  });

  app.post("/api/changepassword", authCtrl.changePassword);
  app.post("/api/is-mobile/verified", authCtrl.setMobileIsVerified);

  // app.get('/api/signup', authCtrl.signup)
  // app.post('/api/signup', authCtrl.signup)

  app.post("/api/contact", authCtrl.contactUs);
  app.get("/api/contact-list", authCtrl.contactUsList);
  app.post("/api/createprofile", authenticateJWT, authCtrl.crateprofile);
  app.post("/api/user/status", authCtrl.userActiveDeactiveStatus);
  app.post("/api/maintenance-mode", authCtrl.maintenanceMode);
  app.post("/api/updateprofile", upload.any(), authCtrl.updateprofile);
  app.post("/api/getalluserlist", authCtrl.getalluser);

  app.post("/api/notification-list", notificationController.list);
  app.post("/api/read-notification", notificationController.readNotification);

  app.post("/api/withdraw-request", UserTripController.withdrawRequest);
  app.get("/api/withdraw-detail", UserTripController.withdrawDetail);
  app.get("/api/withdraw-list", UserTripController.withdrawList);



};

authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];

    if (token) {
      jwt.verify(token, accessTokenSecret, (err, user) => {
        if (err) {
          return res.sendStatus(403);
        }

        if (!user || !user._id) {
          return res.send({ status: false, message: "Not Authorized" });
        }

        if (user.deactive && user.roles != "ADMIN") {
          return res.send({
            status: false,
            message: "Your Account has been deactivated.",
          });
        }
        req.user = user;
        next();
      });
    } else {
      return res.send({ status: false, message: "Not Authorized" });
    }
  } else {
    res.sendStatus(401);
  }
};

module.exports = routefunctions;
