var express = require('express');
var app = express();
var authCtrl = require('../controllers/authController')
var friendCtrl = require('../controllers/friendRequestController')

const jwt = require('jsonwebtoken');
var cors = require('cors')
const accessTokenSecret = require('../config.json').jwd_secret;
var path = require('path')
var multer = require("multer");



var homePageBannerController = require('../controllers/homePageBannerController');


const Path = require('path');
const fs = require('fs');

const blogController = require('../controllers/blogController');

// const { update } = require('../models/otp');
const authController = require('../controllers/authController');
const shopController = require('../controllers/shopController');
const reviewController = require('../controllers/reviewController');
const tagController = require('../controllers/tagController');
const reportController = require('../controllers/reportController');
const appointmentController = require('../controllers/appointmentController');
const adminController = require('../controllers/adminController');
const htmlPagesController = require('../controllers/htmlPagesController');
const frequentlyAskedQuestion = require('../controllers/frequentlyAskedQuestion');
const frontController  = require('../controllers/front.controller');
const settingController  = require('../controllers/setting.controller');
const feedController  = require('../controllers/feeds.controller');

const multerS3 = require('multer-s3');
const aws = require('aws-sdk');

aws.config.update({
  secretAccessKey: 'aoSbNdNF3K2+z31gGJX31RuKTNijkfPWwRxymHAV',
  accessKeyId: 'AKIAXRCHJ4CSM5C36R77',
  region: 'ap-south-1'
});

const s3 = new aws.S3();
const upload = multer({
  storage: multerS3({
      s3: s3,
      bucket: 'choovoo-test',
      key: function (req, file, cb) {
        const str = file.originalname;
        const extension = str.substr(str.lastIndexOf("."));
        const fileName = Date.now() + '' + Math.round(Math.round(Math.random() * 5000)) + '' + extension;
        cb(null, 'public_asset/'+ fileName ); 
      }
  })
});

var routefunctions = (app) => {
 
  app.use(cors());
  

  //All Users API checking prefix
  app.post('/api/send-otp', authCtrl.sendOtp)
  app.post('/api/signup', authCtrl.signup)
  app.post('/api/user/login', authCtrl.loginUser)
  app.post('/api/user/resetPassword', authCtrl.recoverPasswordUser)
  app.post('/api/resetPassword/mobile', authCtrl.forgotpasswordmobile);
  app.get('/api/resetPasswordView/mobile', authCtrl.recoverpasswordmobileview);
  app.post('/api/recoverPassword/mobile', authCtrl.recoverpasswordfrommobile);
  app.post('/api/getprofile', authenticateJWT, authCtrl.getprofile) 

  app.post('/api/verify/otp', authCtrl.verifyOtp)
  app.post('/api/login', authCtrl.login)
  app.post('/api/forgetpassword', authCtrl.forgotpassword);

  app.post('/api/resetPassword', authCtrl.recoverpassword);
   

// friend requests 

app.post('/api/send-friend-request', authenticateJWT, friendCtrl.sendfriendrequest); 
app.post('/api/accept-friend-request', authenticateJWT, friendCtrl.acceptfriendrequest); 
app.post('/api/delete-friend-request', authenticateJWT, friendCtrl.deletefriendrequest); 
  //Shop API
  app.post("/api/create/shop",  authenticateJWT, upload.any() ,shopController.createShop)
  app.post("/api/update/shop", authenticateJWT, shopController.updateShop)
  app.post("/api/get-barber/shop",authenticateJWT,  shopController.getBarberShop)
  app.post("/api/delete/shop", authenticateJWT, shopController.deleteShop)
  app.get("/api/get/shop/review", authenticateJWT, shopController.getShopReview)

  app.post("/api/get-barber-by-loc/shop",authenticateJWT,  shopController.getBarberShopByLocation)
  app.post("/api/get-barber-info/shop",authenticateJWT,  shopController.getBarberShopInfo)
  app.post("/api/get-barber-shop/id",authenticateJWT,  shopController.getBarberShopById)





  // FEED POST APIS BY SUNIL 
  app.post('/api/feed/lists', feedController.list)
  app.post('/api/feed/view', feedController.viewFeed)
  app.post('/api/feed/create', upload.any('feeds'), feedController.create)
  app.delete('/api/feed/:feed_id/delete', feedController.delete)

  app.post('/api/feed/likes', feedController.feedLikes)
  app.post('/api/feed/comment', feedController.feedComment)
  app.delete('/api/comment/:comment_id/delete', feedController.commentDelete)
  app.post('/api/comment/likes', feedController.commentLikes)

  //Shop REVIEW API
    app.post("/api/create/shop/review",  reviewController.createShopReview)
    app.post("/api/delete/shop/review",  reviewController.deleteShopReview)


    //Tag API
    app.post("/api/create/tag", authenticateJWT, tagController.createTag)
    app.post("/api/update/tag", authenticateJWT, tagController.updateTag)
    app.post("/api/delete/tag",authenticateJWT,  tagController.deleteTag)
    app.post("/api/getAll/tag-list",authenticateJWT,  tagController.getAllTagList)
    app.get("/api/get/tag-list",authenticateJWT,  tagController.getTagList)
    

    //User Services Tags
    app.post("/api/create/service-tag", authenticateJWT, tagController.createServiceTag)
    app.post("/api/update/service-tag",authenticateJWT,  tagController.updateServiceTag)
    app.post("/api/delete/service-tag", authenticateJWT, tagController.deleteServiceTag)
    app.post("/api/get/user/service-tag", authenticateJWT, tagController.getUserServiceTag)

    //User Post Reporting
    app.post("/api/create/post-report",authenticateJWT,  reportController.createPostReport)
    app.post("/api/delete/post-report", authenticateJWT, reportController.deletePostReport)
    app.post("/api/get/user/report-list",authenticateJWT,  reportController.getUserPostReport)
    app.post("/api/get/report-list",authenticateJWT,  reportController.getAllPostReport)

    //User Appointment
    app.post("/api/create/user-appointment",authenticateJWT ,  appointmentController.createUserAppointment)
    app.post("/api/update/appointment-status",authenticateJWT ,  appointmentController.updateAppointmentStatus)
    app.get("/api/get-appointment/list",authenticateJWT ,  appointmentController.getAppointmentList)
    app.post("/api/get-appointment/barber/list",authenticateJWT ,  appointmentController.getAppointmentListByBarber)
    app.post("/api/get-appointment/user/list",authenticateJWT ,  appointmentController.getAppointmentListUser)


    //Dashboard API
    app.post('/api/dashboard', authenticateJWT, adminController.dashBoard);

      // Statcic Page Managment API
  app.post('/api/create-html-pages', authenticateJWT, htmlPagesController.createHtmlPages);
  app.put('/api/update-html-pages', authenticateJWT, htmlPagesController.updateHtmlPages);
  app.get('/api/get-html-pages', htmlPagesController.getHtmlPages);
  app.post('/api/getAll-html-pages', htmlPagesController.getAllHtmlPages);
  app.delete('/api/delete-html-pages', authenticateJWT, htmlPagesController.deleteHtmlPages);
  app.put('/api/status-update-html-pages', authenticateJWT, htmlPagesController.statusUpdate);

   // FAQ API
   app.post('/api/create-frequently-asked-question', authenticateJWT, frequentlyAskedQuestion.createFrequentlyAskedAuestion)
   app.get('/api/get-frequently-asked-questionlist', authenticateJWT, frequentlyAskedQuestion.getFrequentlyAskedAuestionList)
   app.get('/api/get-frequently-asked-question-by-userid', authenticateJWT, frequentlyAskedQuestion.getFrequentlyAskedAuestionId)
   app.put('/api/update-frequently-asked-question', frequentlyAskedQuestion.updateFrequentlyAskedQuestion);
   app.delete('/api/delete-frequently-asked-question', frequentlyAskedQuestion.deleteFrequentlyAskedQuestion);


   // Side Setting API
   app.post('/api/list/setting', settingController.list);
   app.post('/api/create/setting', settingController.create);
   app.post('/api/edit/:id/setting', settingController.edit);
   app.post('/api/update/:id/setting', settingController.update);
   // app.post('/delete/:id/setting', settingController.delete);
 

  // app.post('/login', authCtrl.login)
  app.post('/api/user-active', authCtrl.userActive)


  app.post('/api/social/login', authCtrl.socialLogin)
  app.post('/api/deleteuser', authCtrl.deleteuser)

  // USER CUSTOMER APIS
  app.post('/api/send/otp/customer', authCtrl.sendOtpCustomer)
  app.post('/api/verify/otp/customer', authCtrl.verifyOTPCustomer)




  app.post('/api/upload/file', upload.any(), async (req, res, next) => {
    // res.send({ files: req.files.map(i => i.filename) })
    res.end();
  })


  app.post('/api/changepassword', authCtrl.changepassword);
  app.post('/api/is-mobile/verified', authCtrl.setMobileIsVerified);

  // app.get('/api/signup', authCtrl.signup)
  // app.post('/api/signup', authCtrl.signup)

  app.post('/api/contact', authCtrl.contactUs) 
  app.get('/api/contact-list', authCtrl.contactUsList) 
  app.post('/api/createprofile', authenticateJWT, authCtrl.crateprofile)
  app.post('/api/user/status',  authCtrl.userActiveDeactiveStatus)
  app.post('/api/maintenance-mode',  authCtrl.maintenanceMode)
  app.post('/api/updateprofile', authenticateJWT ,upload.any() , authCtrl.updateprofile)
  

  app.post('/api/getalluserlist', authCtrl.getalluser);

}

authenticateJWT = (req, res, next) => {

  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];

    if (token) {
      jwt.verify(token, accessTokenSecret, (err, user) => {
        if (err) {
          return res.sendStatus(403);
        }
      
        if (!user || !user._id) {
          return res.send({ status: false, message: 'Not Authorized' });
        }


        if(user.deactive && user.roles != "ADMIN") {
          return res.send({ status: false, message: 'Your Account has been deactivated.' });   
        }


        req.user = user;
        next();
      });
    } else {
      return res.send({ status: false, message: 'Not Authorized' });
    }
  } else {
    res.sendStatus(401);
  }
};

module.exports = routefunctions; 

