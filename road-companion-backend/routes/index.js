require("dotenv").config();
var express = require("express");
var app = express();
var authCtrl = require("../controllers/auth.controller");

const jwt = require("jsonwebtoken");
var cors = require("cors");
const accessTokenSecret = require("../config.json").jwd_secret;
var path = require("path");
var multer = require("multer");

const Path = require("path");
const fs = require("fs");

const userBackgroundController = require("../controllers/userBackground.controller");

const carController = require("../controllers/car.controller");
const UserTripController = require("../controllers/userTrip.controller");
const reviewController = require("../controllers/review.controller");
const tagController = require("../controllers/tag.controller");
const reportController = require("../controllers/report.controller");
const notificationController = require("../controllers/notification.controller");

const adminController = require("../controllers/admin.controller");
const htmlPagesController = require("../controllers/htmlPages.controller");
const frequentlyAskedQuestion = require("../controllers/frequentlyAskedQuestion.controller");

const settingController = require("../controllers/setting.controller");
const paymentController = require("../controllers/payment.controller");

const multerS3 = require("multer-s3");
const aws = require("aws-sdk");
const tripPanelController = require("../controllers/tripPanel.controller");

// const bucketName = 'road-companion';
// aws.config.update({
//   secretAccessKey: 'i+o20/M8C3LiOT6LeMqWrxqpfjvcYj/lsSUq7Wy8',
//   accessKeyId: 'AKIARBDVKRD6UKN7IFZH',
//   region: "us-east-2",
// });

// const bucketName = "choovo";
// aws.config.update({
//   secretAccessKey: "0B17xDhxzWKaCnsyRSh2JhrPWOyBX444X2OSvGnO",
//   accessKeyId: "AKIAWWJZRMFSMBPU22HY",
//   region: "ap-south-1",
// });

// const s3 = new aws.S3();
// const upload = multer({
//   storage: multerS3({
//     s3: s3,
//     bucket: bucketName,
//     key: function (req, file, cb) {
//       const str = file.originalname;
//       const extension = str.substr(str.lastIndexOf("."));
//       const fileName = Date.now() + "" + Math.round(Math.round(Math.random() * 5000)) + "" + extension;
//       cb(null, "public_asset/" + fileName);
//     },
//   }),
// });


aws.config.update({
  secretAccessKey: '2lreh2f3bWpuUgtb1TT+hLRv8USzFdsFPClB3dD4',
  accessKeyId: 'AKIAWWJZRMFSH5PXV342',
  region: 'ap-south-1'
});

const s3 = new aws.S3();
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'choovo',
    key: function (req, file, cb) {
      const str = file.originalname;
      const extension = str.substr(str.lastIndexOf("."));
      const fileName = Date.now() + '' + Math.round(Math.round(Math.random() * 5000)) + '' + extension;
      cb(null, 'public_asset/' + fileName);
    }
  })
});





// const deleteFilesFromS3 = (image) => {
//   //  let image = 'public_asset/16472433016711419.jpg';
//   const params = {
//     Bucket: bucketName,
//     Key: image,
//   };

//   s3.deleteObject(params, (err, data) => {
//     if (error) {
//       res.status(500).send(error);
//     }
//     res.status(200).send("File has been deleted successfully");
//   });
// };

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
  app.delete("/api/delete-car", carController.deleteCar);
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
  app.post("/api/upload-data", carController.uploadData);
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

  app.post("/api/wallet-trip-payment", UserTripController.walletTripPayment);

  app.post("/api/initiate-trip-payment", UserTripController.initiateTripPayment);
  app.post("/api/confirm-trip", UserTripController.tripPayment);
  app.post("/api/confirm-trip/test", UserTripController.confirmTripTest);

  app.post("/api/trip-status-update", UserTripController.tripStatusUpdate);
  app.post("/api/ride-status-update", UserTripController.rideStatusUpdate);

  // When user confirm a trip than active chat system to driver or passanger
  app.post("/api/get-chat-lists", UserTripController.getChatList);



  app.post("/api/get-trips", UserTripController.getTrips);
  app.post("/api/nearby-trip-detail", UserTripController.nearBytripDetail);
  app.post("/api/get-trips-by-date", UserTripController.getTripByDate);
  app.post("/api/get-all-trips-by-date", UserTripController.getAllTripByDate);

  app.post("/api/my-driver-trip-detail", UserTripController.driverCreatedTripDetail);
  app.post("/api/passenger-booked-trip-detail", UserTripController.passengerBookedTripDetail);
  app.post("/api/accept-decline-trip", UserTripController.acceptDeclineTrip);



  
  // STRIPE PAYMENT CONTROLLER ROUTES
  app.post("/api/add-card-stripe", paymentController.addCardStripe);
  app.post("/api/driver-payment-request",paymentController.driverPaymentRequest);
  app.get("/api/create-stripe-account", paymentController.createStripeAccount);
  app.post("/api/get-add-cash-transactions", paymentController.getAddCashTransactions);
  app.post("/api/get-withdraw-history", paymentController.getWithdrawHistory);
  app.post("/api/add-cash-user", paymentController.addCashUser);
  app.post("/api/add-cash-callback-url", paymentController.addCashUserCallback);


  // ADMIN APIS STRIPE SEND
  app.post("/api/get-all-withdraw-request",paymentController.getAllWithdrawRequests);
  app.post("/api/send-driver-request-payment", paymentController.sendDriverRequestPayment);
  app.post('/api/get-wallet-add-cash-list', paymentController.addCashList)

  // USER BACKGROUNDS
  app.post("/api/add-background", upload.any(), userBackgroundController.addBackground);
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

  app.post("/api/get-user-trips-list", tripPanelController.getTripsLists);



   // Statcic Page Managment API
 app.post('/api/create-html-pages', authenticateJWT, htmlPagesController.createHtmlPages);
 app.put('/api/update-html-pages', authenticateJWT, htmlPagesController.updateHtmlPages);
 app.get('/api/get-html-pages', htmlPagesController.getHtmlPages);
 app.post('/api/getAll-html-pages', htmlPagesController.getAllHtmlPages);
 app.delete('/api/delete-html-pages', authenticateJWT, htmlPagesController.deleteHtmlPages);
 app.put('/api/status-update-html-pages', authenticateJWT, htmlPagesController.statusUpdate);
 app.get('/api/terms-and-conditions', htmlPagesController.tAndC);
 app.get('/api/privacy-policy', htmlPagesController.privacyPolicy);

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
