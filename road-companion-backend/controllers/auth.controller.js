const db = require("../_helper/db");
const UserLogins = db.UserLogins;
const UserVehicle = db.UserVehicle;
const Review = db.Review;

const Profile = db.Profile;
const otp = db.Otp;
const accessTokenSecret = require("../config.json").jwd_secret;
var ROLES = require("../config.json").ROLES;
const jwt = require("jsonwebtoken");
let mongoose = require("mongoose");
const SendNotification = require("../_helper/send-notification.js");
var request = require("request");
var path = require("path");
var nodemailer = require("nodemailer");
let bcrypt = require("bcrypt");
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "mail786tester@gmail.com",
    pass: "oaelwbhhckizzoce",
  },
});
const aws = require("aws-sdk");
let adminEmail = "admin@galinukkad.com";
const Helper = require("../core/helper");
// const sharp = require('sharp');
var path = require("path");
var fs = require("fs");
var request = require("request");
const excel = require("exceljs");

let saltRounds = 10;
notEmpty = (obj) => {
  let t = Object.keys(obj).filter(
    (i) => obj[i] == undefined || obj[i].toString().length == 0
  );
  console.log("t", t);
  if (t.length > 0) {
    return false;
  } else {
    return true;
  }
};
let api_key = "3bc27ef827668484358972ef4d81183c28b5867e64b29cdf";
let api_token = "51c9d0e8d625d2181e37f6de5a263020d17a4561829dfe81";
let s_id = "galinukkad1";
let subdomain = "@api.exotel.com";

let block_user_messsage = `Your Account has been deactivated.`;

function sendSms(mobile_number, msg_body) {
  return new Promise(async (resolve, reject) => {
    try {
      const apiData = `From=08047187076&To=${mobile_number}&Body=${msg_body}`;
      const url = `https://${api_key}:${api_token}${subdomain}/v1/Accounts/${s_id}/Sms/send`;

      request(
        {
          url: url,
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: apiData,
        },
        (err, response) => {
          console.log("EEEEEEEE", err, response.statusCode, response.body);
          if (!err && response.statusCode == 200) {
            return resolve(true);
          } else {
            return resolve(false);
          }
        }
      );
    } catch (error) {
      return resolve(false);
    }
  });
}

module.exports = {
  sendsms: async (req, res, next) => {
    const f = await sendSms(
      req.body.phone,
      generateOTP() +
        " is your OTP for Login Transaction on Galinukkad and valid till 10 minutes. Do not share this OTP to anyone for security reasons."
    );
    res.send({
      status: f,
      message: f
        ? "SMS sent successfully"
        : "Something went wrong, when sent SMS",
    });
  },

  signup: async (req, res, next) => {
    try {
      const { email, password, roleType, firebase_fcm_token } = req.body;

      const d = new Date();

      // if (!name)
      //     return res.send({ status: 400, message: "name is required" });

      if (!email)
        return res.send({ status: 400, message: "Email is required" });

      if (!password)
        return res.send({ status: 400, message: "Password is required" });

      // if (!mobile_number)
      //     return res.send({ status: 400, message: "Mobile No. is required" });

      if (!roleType || ROLES.indexOf(roleType) == -1)
        return res.send({ status: false, message: "Role is not valid" });

      const hash = bcrypt.hashSync(password, saltRounds);

      const userOtp = generateOTP();

      const data = {
        email: email,
        password: hash,
        roles: roleType,
        otp: userOtp,
        firebase_fcm_token: firebase_fcm_token,
        isEmailVerified: true,
        user_status: true,
      };

      const isUser = await UserLogins.findOne({ $or: [{ email: email }] })
        .lean()
        .exec();

      if (isUser) {
        let msg = "This";
        if (isUser.email === email) {
          msg += " Email";
        }
        msg += " is already registered";

        return res.send({ status: 400, message: msg });
      }

      const userLoginCreate = await new UserLogins(data).save();

      let isUser1 = await UserLogins.findOne({
        $or: [{ email: userLoginCreate.email }],
      })
        .lean()
        .exec();

      isUser1 = {
        username: isUser1.email,
        _id: isUser1._id,
        time: new Date().getTime(),
        role: isUser1.roles,
      };

      const accessToken = jwt.sign(isUser1, accessTokenSecret);

      let msg_body = "Hi, <br />";
      msg_body += "Your account has been added on Road companion <br />";
      msg_body += "Please find below your login credentials:<br />";

      msg_body += "Email: " + email + "<br />";
      msg_body += "Password: " + password + "<br />";
      msg_body += "<br />Thanks,<br /Road companion";

      return res.send({
        status: 200,
        user: userLoginCreate,
        accessToken: accessToken,
        message: `${roleType} Sign Up Successfully.`,
      });
    } catch (error) {
      if (error.errmsg && error.errmsg.indexOf("E11000") > -1) {
        return res.send({
          status: 403,
          message:
            "User Already Exist, Please try with other username or email",
        });
      }

      return res.send({ status: 400, message: error.message });
    }
  },

  sendOtp: async (req, res, next) => {
    try {
      const { email, type } = req.body;
      if (!email)
        return res
          .status(400)
          .send({ status: false, message: "Email is required" });

      const userOtp = generateOTP();

      let msg_body = "Hi, <br />";
      msg_body += " your OTP(One Time Password) is " + userOtp;
      msg_body += "<br />Thanks,<br />Road Companion  Team";

      const isUser = await UserLogins.findOne({ $or: [{ email: email }] })
        .lean()
        .exec();

      if (!isUser && type === "register") {
        // await Helper.sendEmail(email, 'New Signup', msg_body);
        return res.status(200).send({ status: 200, Otp: userOtp });
      }
      if (isUser && type === "forgot") {
        //await Helper.sendEmail(email, 'Forgot Password', msg_body);
        return res.status(200).send({ status: 200, Otp: userOtp });
      }

      if (isUser) {
        return res
          .status(500)
          .send({ status: 500, message: "User Already exist!" });
      }

      return res.status(500).send({ status: 500, message: "User not found!" });
    } catch (error) {
      return res.status(400).send({ status: 400, err: e.message });
    }
  },

  verifyOtp: async (req, res, next) => {
    try {
      const { mobile_number, userName, email, otp } = req.body;
      let isUser;

      if (!email && !userName && !mobile_number) {
        return res.send({
          status: false,
          message:
            "Required parameter missing, Please provide email  or mobile number",
        });
      }

      if (!otp) {
        return res.send({ status: false, message: "OTP is required" });
      }

      if (email || userName) {
        isUser = await UserLogins.findOne({
          $or: [{ email: email }, { username: userName }],
        })
          .lean()
          .exec();
        if (!isUser) {
          return res.send({ status: false, message: "User not found" });
        }

        if (isUser.otp == otp || isUser.mobile_otp == otp) {
          await UserLogins.findByIdAndUpdate(isUser._id, {
            isEmailVerified: true,
            user_status: true,
          });

          if (isUser.roles !== ROLES[3]) {
            const accessToken = jwt.sign(isUser, accessTokenSecret);
            return res.send({
              status: true,
              message: "OTP Verified",
              accessToken: accessToken,
              userId: isUser._id,
            });
          } else {
            const userData = {
              username: isUser.email,
              _id: isUser._id,
              time: new Date().getTime(),
              role: isUser.roles,
            };
            const accessToken = jwt.sign(isUser, accessTokenSecret);

            await UserLogins.findByIdAndUpdate(isUser._id, {
              $inc: { no_of_loggedin: 1 },
              last_login_time: new Date(),
            });
            return res.send({
              status: true,
              user: userData,
              accessToken: accessToken,
            });
          }
        } else {
          return res.send({ status: false, message: "OTP Not Verified" });
        }
      } else if (mobile_number) {
        const isUser = await UserLogins.findOne({
          mobile_number: mobile_number,
        })
          .lean()
          .exec();

        if (!isUser) {
          return res.send({ status: false, message: "User not found" });
        }

        if (isUser.mobile_otp === otp) {
          await UserLogins.findByIdAndUpdate(isUser._id, {
            isMobileVerified: true,
          });

          if (isUser.roles !== ROLES[3]) {
            const accessToken = jwt.sign(isUser, accessTokenSecret);
            return res.send({
              status: true,
              message: "OTP Verified",
              accessToken: accessToken,
              userId: isUser._id,
            });
          } else {
            const userData = {
              username: isUser.email,
              _id: isUser._id,
              time: new Date().getTime(),
              role: isUser.roles,
            };
            const accessToken = jwt.sign(isUser, accessTokenSecret);

            await UserLogins.findByIdAndUpdate(isUser._id, {
              $inc: { no_of_loggedin: 1 },
              last_login_time: new Date(),
            });
            return res.send({
              status: true,
              user: userData,
              accessToken: accessToken,
            });
          }
        } else {
          return res.send({ status: false, message: "OTP Not Verified" });
        }
      } else {
        return res.send({ status: false, message: "Something went wrong" });
      }
    } catch (e) {
      console.log(e);
      return res.send({ status: false, err: e.message });
    }
  },

  login: async (req, res, next) => {
    const { username, password, isOtp } = req.body;

    if (!isOtp) {
      res.send({ status: false, message: "please provide isOtp" });
    } else {
      if (isOtp == 0) {
        // if is otp is false
        UserLogins.findOne({ $or: [{ email: username }] }).then((data) => {
          if (data && data._id) {
            let user_detail = data;

            let user = {
              username: data.email,
              _id: data._id,
              time: new Date().getTime(),
              role: data.roles,
            };
            const accessToken = jwt.sign(user, accessTokenSecret);

            let compare = bcrypt.compareSync(password, data.password);
            if (!compare) {
              if (data.password === password) {
                UserLogins.updateOne(
                  { _id: data._id },
                  { $set: { last_login_time: new Date() } }
                ).then({});
                res.json({
                  status: true,
                  accessToken,
                  user: data,
                  user_detail: user_detail,
                });
                return;
              }
              res.send({ status: false, message: "Invalid password!" });
            } else {
              UserLogins.updateOne(
                { _id: data._id },
                { $set: { last_login_time: new Date() } }
              ).then({});
              return res.json({
                status: true,
                accessToken,
                user,
                user_detail: user_detail,
              });
            }
          } else {
            res.send({ status: false, message: "email not found" });
          }
        });
      } else if (isOtp == 1) {
        // if login by otp is true
        // let otp = Math.floor(1000 + Math.random() * 9000);
        console.log("otp is not false");
        let otp = generateOTP();

        if (username) {
          UserLogins.findOne({ $or: [{ email: username }] })
            .then((data) => {
              UserLogins.updateOne({ email: username }, { $set: { otp: otp } })
                .then((user) => {
                  var mailOptions = {
                    from: "mailto:no-reply@gmail.com",
                    to: username,
                    subject: "New Signup",
                    text: `Your one time otp is ${otp}`,
                  };
                  transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                      console.log(error);
                    } else {
                      console.log("Email sent: " + info.response);
                    }
                  });
                  res.send({ status: true, message: "Otp sent!" });
                  return;
                })
                .catch((err) => {
                  res.send({ status: false, err: "An Error Occured" });
                  return;
                });
            })
            .catch((err) => {
              res.send({ status: false, err: "An Error Occured" });
              return;
            });
        } else if (mobile_number) {
          UserLogins.findOne({ $or: [{ mobile_number: mobile_number }] })
            .then((data) => {
              UserLogins.updateOne(
                { mobile_number: mobile_number },
                { $set: { otp: otp } }
              )
                .then(async (user) => {
                  await sendSms(
                    mobile_number,
                    generateOTP() +
                      " is your OTP for Login Transaction on Galinukkad and valid till 10 minutes. Do not share this OTP to anyone for security reasons."
                  );

                  res.send({ status: true, message: "Otp sent!" });
                  return;
                })
                .catch((err) => {
                  res.send({ status: false, err: "An Error Occured" });
                  return;
                });
            })
            .catch((err) => {
              res.send({ status: false, err: "An Error Occured" });
              return;
            });
        }
      }
    }
  },

  loginUser: async (req, res, next) => {
    const { username, password, firebase_fcm_token } = req.body;

    console.log("working");

    UserLogins.findOne({ $or: [{ email: username }] }).then((data) => {
      if (data && data._id) {
        let user_detail = data;
        let user = {
          mobile_number: data.mobile_number,
          avatar: data.avatar,
          email: data.email,
          name: data.username,
          _id: data._id,
          time: new Date().getTime(),
          role: data.roles,
        };
        const accessToken = jwt.sign(user, accessTokenSecret);

        let compare = bcrypt.compareSync(password, data.password);
        if (!compare) {
          if (data.password === password) {
            UserLogins.updateOne(
              { _id: data._id },
              { $set: { last_login_time: new Date(), firebase_fcm_token } }
            ).then({});
            res.json({
              status: true,
              accessToken,
              user,
            });
            return;
          }
          res.status(400).send({ message: "Invalid password!" });
        } else {
          UserLogins.updateOne(
            { _id: data._id },
            { $set: { last_login_time: new Date(), firebase_fcm_token } }
          ).then({});
          return res.json({
            status: true,
            accessToken,
            user,
          });
        }
      } else {
        res.status(400).send({ message: "email not found" });
      }
    });
  },

  socialLogin: async (req, res, next) => {
    // try {
    const { type, socialid, email, username, profile_link, ip_address } =
      req.body;
    // let user = await UserLogins.findOne({ $or: [{ email: email }, { username: username }] });
    let user = await UserLogins.findOne({ email: email });
    console.log(user);
    if (!user) {
      // if user is not available
      let role_type = "CUSTOMER";
      let password = generateOTP();
      const hash = bcrypt.hashSync(password, saltRounds);

      let createData = {
        username: username,
        email: email,
        password: hash,
        roles: role_type,
        socialid: socialid,
        type_login: type,
        ip_address: ip_address,
        isEmailVerified: true,
        mobile_number: "",
      };

      console.log(createData);

      UserLogins.create(createData).then((data) => {
        Profile.create({
          email: email,
          name: username,
          phone: "",
          gender: "",
          dob: new Date(),
          photo: profile_link,
          loginid: data._id,
        }).then((profile) => {
          let user = {
            username: data.username,
            email: data.email,
            _id: data._id,
            time: new Date().getTime(),
            role: role_type,
          };
          const accessToken = jwt.sign(user, accessTokenSecret);
          res.send({
            status: true,
            accessToken,
            user,
          });
        });
      });
    } else {
      // if user is available
      let token = {
        username: user.email,
        _id: user._id,
        time: new Date().getTime(),
        role: user.roles,
      };
      const accessToken = jwt.sign(token, accessTokenSecret);
      res.send({
        status: true,
        accessToken,
        user,
      });
    }
    // } catch (e) {
    //     console.log(e)
    //     return res.send({ status: false, err: e.message });
    // }
  },

  userActive: async (req, res, next) => {
    let _id = req.body._id;

    let isuser = await UserLogins.findById({ _id });
    if (isuser) {
      if (isuser.user_status === "active") {
        res.status(200).send({
          status: true,
          user_status: isuser.user_status,
        });
      } else {
        res.send({
          status: false,
        });
      }
    } else {
      res.send({
        status: false,
      });
    }
  },

  sendOtpToUser: async (req, res, next) => {
    try {
      const reqBody = req.body;
      const Email = reqBody.email;
      const Username = reqBody.username;
      const mobileNumber = reqBody.mobile_number;

      if (!Email && !Username && !mobileNumber) {
        return res.send({
          status: false,
          message:
            "Required parameter missing, Please provide email username or mobile number",
        });
      }

      const userOtp = generateOTP();

      if (Email || Username) {
        const isUser = await UserLogins.findOne({
          $or: [{ email: Email }, { username: Username }],
        });
        if (!isUser) {
          return res.send({ status: false, message: "User not found" });
        }

        if (isUser && isUser.deactive) {
          return res.send({ status: false, message: block_user_messsage });
        }

        let msg_body = `Hi, ${isUser.username} <br />`;
        msg_body += "Your One Time Password is " + userOtp;
        msg_body += "<br />Thanks,<br />Gali Nukkad Team";

        await UserLogins.findByIdAndUpdate(isUser._id, { otp: userOtp })
          .lean()
          .exec();
        Helper.sendEmail(isUser.email, "OTP Verification", msg_body);

        return res.send({ status: true, message: "OTP send to your email" });
      } else if (mobileNumber) {
        const isUser = await UserLogins.findOne({
          mobile_number: mobileNumber,
        });

        if (isUser && isUser.deactive) {
          return res.send({ status: false, message: block_user_messsage });
        }

        if (!isUser) {
          return res.send({ status: false, message: "User not found" });
        }

        await sendSms(
          mobileNumber,
          `${userOtp} is your OTP for Login Transaction on Galinukkad and valid till 10 minutes. Do not share this OTP to anyone for security reasons.`
        );

        await UserLogins.findByIdAndUpdate(isUser._id, { mobile_otp: userOtp })
          .lean()
          .exec();
        return res.send({
          status: true,
          message: "OTP send to your Phone No.",
        });
      } else {
        return res.send({ status: false, message: "Something went wrong" });
      }
    } catch (error) {
      return res.send({ status: false, err: e.message });
    }
  },

  sendOtpCustomer: async (req, res, next) => {
    console.log(req.body);
    try {
      let { phone, email } = req.body;

      let mobileVerified = await UserLogins.findOne({
        mobile_number: phone,
        isMobileVerified: true,
      });

      if (mobileVerified) {
        return res.send({
          status: false,
          message: "Mobile number already registered.",
        });
      }

      let user = await UserLogins.find({ email: email });
      if (user) {
        const generated_otp = generateOTP();
        await sendSms(
          phone,
          generated_otp +
            " is your OTP for Login Transaction on Galinukkad and valid till 10 minutes. Do not share this OTP to anyone for security reasons."
        );

        let set_update = {
          mobile_otp: generated_otp,
          mobile_number: phone,
        };

        let user_login_id = await UserLogins.updateOne(
          { email: email },
          { $set: set_update }
        ).then({});

        return res.send({
          status: true,
          message: "OTP has been send successfully.",
        });
      }
    } catch (e) {
      console.log(e);
      return res.send({ status: false, message: e.message });
    }
  },

  verifyOTPCustomer: async (req, res, next) => {
    try {
      let { phone, email, mobile_otp } = req.body;
      console.log(req.body);

      let user_find = await UserLogins.find({
        email: email,
        mobile_otp: mobile_otp,
      });

      if (user_find != undefined && user_find != "" && user_find != null) {
        await UserLogins.updateOne(
          { email: email, mobile_number: phone, mobile_otp: mobile_otp },
          { $set: { isMobileVerified: true } }
        ).then({});
        return res.send({
          status: true,
          message: "Mobile number verified successfully",
        });
      } else {
        return res.send({ status: false, message: "Please enter valid otp" });
      }
    } catch (e) {
      console.log(e);
      return res.send({ status: false, message: e.message });
    }
  },

  userActiveDeactiveStatus: async (req, res, next) => {
    try {
      console.log("hello");
      let { id } = req.body;

      UserLogins.findById(id, function (err, data) {
        data.user_status = !data.user_status;
        data.save((err, result) => {
          if (result) {
            return res.send({
              status: true,
              message: "User action changed successfully",
            });
          } else {
            return res.send({ status: false, message: err });
          }
        });
      });
    } catch (e) {
      console.log(e);
      return res.send({ status: false, message: e.message });
    }
  },

  maintenanceMode: async (req, res, next) => {
    try {
      let { id } = req.body;

      UserLogins.findById(id, function (err, data) {
        data.maintenance_mode_for_user = !data.maintenance_mode_for_user;

        console.log(data.maintenance_mode_for_user);
        data.save((err, result) => {
          if (result) {
            return res.send({
              status: true,
              message: "User action changed successfully",
            });
          } else {
            return res.send({ status: false, message: err });
          }
        });
      });
    } catch (e) {
      console.log(e);
      return res.send({ status: false, message: e.message });
    }
  },

  recoverPasswordUser: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(500)
          .send({ status: false, message: "please provide required params" });
      }

      const isUser = await UserLogins.findOne({ email: email });

      if (!isUser) {
        return res.status(400).send({ status: 400, message: "User not found" });
      }

      const hashPassword = bcrypt.hashSync(password, saltRounds);

      console.log("hashPassword ----------");
      console.log(hashPassword);
      console.log(isUser);

      await UserLogins.findByIdAndUpdate(isUser._id, {
        password: hashPassword,
      });

      console.log("pass updated");
      return res
        .status(200)
        .send({
          status: 200,
          message: "Password updated successfully Please Login !",
        });
    } catch (error) {
      return res.status(400).send({ status: 400, message: error.message });
    }
  },

  getalluser: async (req, res, next) => {
    try {
      const reqBody = req.body;
      const Limit = reqBody.limit ? parseInt(reqBody.limit) : 10;
      const PageNo = reqBody.page ? parseInt(reqBody.page) : 0;
      const sortColumn = reqBody.sortColumn ? reqBody.sortColumn : "updated";
      const sortType = reqBody.sortType ? reqBody.sortType == "asc" ? 1 : -1 : -1;


      let role = reqBody.role;
 
      if (role && !ROLES.includes(role)) {
        return res.send({ status: false, message: "Not valid role" });
      }

      const MATCH = {};
      MATCH.$or = [];
      MATCH.$and = [];

      if (role) {
        MATCH.$and.push({ roles: role });
      }

      if (!MATCH.$or.length) {
        delete MATCH.$or;
      }
      if (!MATCH.$and.length) {
        delete MATCH.$and;
      }

      const data = await UserLogins.aggregate([
        {
          $lookup: {
            from: "profiles",
            localField: "_id",
            foreignField: "loginid",
            as: "profileInfo",
          },
        },

        { $unwind: { path: "$profileInfo", preserveNullAndEmptyArrays: true } },
        {
          $project: {
            roles: 1,
            id: 1,
            email: 1,
            gstin: 1,
            fssai: 1,
            mobile_number: 1,
            isEmailVerified: 1,
            username: 1,
            name: 1,

            user_status: 1,
          },
        },
        { $match: MATCH },
        { $sort: { [sortColumn]: sortType } },
        { $skip: Limit * PageNo },
        { $limit: Limit },
      ]);

      const countUser = await UserLogins.aggregate([
        {
          $lookup: {
            from: "profiles",
            localField: "_id",
            foreignField: "loginid",
            as: "profileInfo",
          },
        },
        { $unwind: { path: "$profileInfo", preserveNullAndEmptyArrays: true } },
        {
          $project: {
            roles: 1,
            id: 1,
            email: 1,
            gstin: 1,
            fssai: 1,
            mobile_number: 1,
            isEmailVerified: 1,
            isBussinessVerified: 1,
            name: 1,
            name: "$profileInfo.name",
            photo: "$profileInfo.photo",
            create: "$profileInfo.create",
            user_status: {
              $cond: {
                if: { $eq: ["$user_status", "deactive"] },
                then: "deactive",
                else: "active",
              },
            },
          },
        },
        { $match: MATCH },
      ]);

      return res.send({
        status: true,
        data: data,
        total: countUser.length,
        message: "Users get successfully",
      });
    } catch (error) {
      return res.send({ status: false, message: error.message });
    }
  },

  deleteuser: async (req, res, next) => {
    try {
      const { _id } = req.body;
      if (!_id) {
        res.send({ status: false, message: "Not valid id" });
        return;
      }

      const deleteUser = await UserLogins.findByIdAndDelete(_id);
      if (!deleteUser) {
        return res.send({ status: false, message: "User not found" });
      }
      const deleteProfile = await Profile.findOneAndDelete({ loginid: _id });
      return res.send({ status: true, message: "User deleted successfully" });
    } catch (error) {
      return res.send({ status: false, message: error.message });
    }
  },

  forgotpassword: async (req, res, next) => {
    try {
      const { username } = req.body;
      const newOtp = generateOTP();

      if (!username) {
        return res.send({ status: false, message: "please provide email" });
      }

      const isUser = await UserLogins.findOne({ $or: [{ email: username }] });

      if (!isUser) {
        return res.send({ status: false, message: "User not found" });
      }
      if (isUser && isUser.deactive) {
        return res.send({ status: false, message: block_user_messsage });
      }

      if (isUser.deactive && isUser.roles != "ADMIN") {
        return res.send({ status: false, message: block_user_messsage });
      }

      const isOtp = await otp.findOneAndUpdate(
        { loginid: isUser._id },
        { $inc: { attempt: 1 }, otp: newOtp }
      );

      if (!isOtp) {
        const json = { loginid: isUser._id, otp: newOtp };
        await new otp(json).save();
      }

      Helper.sendEmail(
        isUser.email,
        `Your Verification code`,
        `Your verification code to reset your password is ${newOtp}.`
      );
      return res.send({
        status: true,
        message: "Otp sent to your email address",
      });
    } catch (error) {
      return res.send({ status: false, message: error.message });
    }
  },

  forgotpasswordmobile: async (req, res, next) => {
    try {
      const { username } = req.body;
      const newOtp = generateOTP();

      if (!username) {
        return res
          .status(400)
          .send({ status: 400, message: "please provide email" });
      }

      const isUser = await UserLogins.findOne({ $or: [{ email: username }] });

      if (!isUser) {
        return res.status(400).send({ status: 400, message: "User not found" });
      }
      if (isUser && isUser.deactive) {
        return res
          .status(400)
          .send({ status: 400, message: block_user_messsage });
      }

      if (isUser.deactive && isUser.roles != "ADMIN") {
        return res
          .status(400)
          .send({ status: 400, message: block_user_messsage });
      }

      const isOtp = await otp.findOneAndUpdate(
        { loginid: isUser._id },
        { $inc: { attempt: 1 }, otp: newOtp }
      );

      if (!isOtp) {
        const json = { loginid: isUser._id, otp: newOtp };
        await new otp(json).save();
      }

      let msg_body = `Hi, ${isUser.username}<br />`;
      msg_body += "Please hit the Below link <br />";
      msg_body += `<a href="http://13.234.31.171/api/resetPasswordView/mobile?q=${isUser._id}">reset password</a>:<br />`;

      await Helper.sendEmail(
        isUser.email,
        `Your Verification code`,
        `Your verification code to reset your password is ${newOtp}`
      );

      // await Helper.sendEmail(isUser.email, 'Reset Password', msg_body);

      return res
        .status(200)
        .send({
          status: 200,
          message: "Otp sent to your email address",
          otp: newOtp,
        });
    } catch (error) {
      return res.status(500).send({ status: 500, message: error.message });
    }
  },

  recoverpassword: async (req, res, next) => {
    try {
      const { username, old_password, password, otpchk } = req.body;
      if (!username || !password || !otpchk) {
        return res.send({
          status: false,
          message: "please provide required params",
        });
      }

      const isUser = await UserLogins.findOne({
        $or: [{ email: username }, { username: username }],
      });

      if (!isUser) {
        return res.send({ status: false, message: "User not found" });
      }

      let current_password = isUser.password;
      console.log(otpchk);

      if (old_password === undefined) {
        let otpverify = await otp.findOne({ loginid: isUser._id, otp: otpchk });
        if (otpverify) {
          const hashPassword = bcrypt.hashSync(password, saltRounds);
          await UserLogins.findByIdAndUpdate(isUser._id, {
            password: hashPassword,
          });
          await otp.deleteOne({ loginid: isUser._id }, { otp: otpchk });

          return res.send({
            status: true,
            message: "Password updated successfully",
          });
        } else {
          return res.send({ status: false, message: "Otp Not valid" });
        }
      } else {
        const checkPassword = await bcrypt.compare(
          old_password,
          current_password
        );
        console.log(checkPassword);
        if (checkPassword == false) {
          return res.send({
            status: false,
            message: "Current password not matched for your old password",
          });
        }

        const hashPassword = bcrypt.hashSync(password, saltRounds);
        await UserLogins.findByIdAndUpdate(isUser._id, {
          password: hashPassword,
        });

        return res.send({
          status: true,
          message: "Password updated successfully",
        });
      }
    } catch (error) {
      return res.send({ status: false, message: error.message });
    }

    // UserLogins.findOne({ $or: [{ email: username }, { username: username }] }).then(data => {

    //     if (data && data._id) {
    //         let newotp = generateOTP()

    //         otp.find({ loginid: data._id, otp: otpchk }).then(otpdata => {
    //             if (otpdata.length > 0) {
    //                 UserLogins.update({ $or: [{ email: username }, { username: username }] }, { password: password }).then(d => {

    //                     res.send({ status: true, message: "Updated" })
    //                 })
    //             } else {
    //                 res.send({ status: false })
    //             }
    //         })
    //     }
    // })
  },
  recoverpasswordfrommobile: async (req, res, next) => {
    try {
      const { id, password, confirm_password } = req.body;

      if (!password) {
        return res.send({
          status: false,
          message: "please provide required params",
        });
      }

      if (password === confirm_password) {
        const isUser = await UserLogins.findOne({ $or: [{ _id: id }] });

        if (!isUser) {
          return res.send({ status: false, message: "User not found" });
        }

        let current_password = isUser.password;

        const hashPassword = bcrypt.hashSync(password, saltRounds);
        await UserLogins.findByIdAndUpdate(isUser._id, {
          password: hashPassword,
        });
        return res.send({
          status: true,
          message: "Password updated successfully Please Login !",
        });
      } else {
        return res.send({
          status: true,
          message: "Password and Confirm password does not match!",
        });
      }
    } catch (error) {
      return res.send({ status: false, message: error.message });
    }
  },
  recoverpasswordmobileview: async (req, res, next) => {
    const { q } = req.query;

    res.render("resetPassword", {
      id: q,
    });
  },

  changePassword: async (req, res, next) => {
    try {
      const { username, old_password, password } = req.body;

      if (!username || !password || !old_password) {
        return res
          .status(400)
          .send({ status: 400, message: "please provide required params" });
      }

      const isUser = await UserLogins.findOne({ $or: [{ email: username }] });

      if (!isUser) {
        return res.send({ status: 400, message: "User not found" });
      }
      let current_password = isUser.password;

      const checkPassword = await bcrypt.compare(
        old_password,
        current_password
      );
      if (checkPassword == false) {
        return res.send({
          status: 400,
          message: "Current password not matched for your old password",
        });
      }
      const hashPassword = bcrypt.hashSync(password, saltRounds);
      await UserLogins.findByIdAndUpdate(isUser._id, {
        password: hashPassword,
      });

      return res.send({
        status: 200,
        message: "Password updated successfully",
      });
    } catch (error) {
      return res.send({ status: 400, message: error.message });
    }
  },

  uploadimg: (req, res, next) => {
    try {
      console.log("api hit!!");
      console.log(req.files);
      res.send({ files: req.files.map((i) => i.filename) });
    } catch (e) {
      console.log(e);
    }
  },

  crateprofile: (req, res, next) => {
    const { email, phone, name, gender, dob, photo } = req.body;
    if (!email || !phone || !name || !gender || !dob || !photo) {
      res.send({ status: false, message: "Required Parameter is missing" });
      return;
    }

    Profile.create({
      email,
      phone,
      name,
      gender,
      dob,
      photo,
      loginid: req.user._id,
    })
      .then((data) => {
        res.send({ status: true, data });
        return;
      })
      .catch((err) => {
        res.send({
          status: false,
          message: "error Occured While create profile",
        });
        return;
      });
  },

  addVehicle: async (req, res, next) => {
    try {
      const reqBody = req.body;
      const car_images = [];
      let certification;

      if (req.files.length > 0) {
        for (let i = 0; i < req.files.length; i++) {
          let fieldname = req.files[i].fieldname;
          if (fieldname == "images") {
            car_images.push(req.files[i].location);
          }

          if (fieldname == "insurance_certificate") {
            certification = req.files[0].location;
          }
        }
      }

      const jsonData = {
        make_id: reqBody.make_id,
        type_id: reqBody.type_id,
        user_id: reqBody.user_id,
        model_id: reqBody.model_id,
        year: reqBody.year,
        colour: reqBody.colour,
        seat_available: reqBody.seat_available,
        carrying_capacity: reqBody.carrying_capacity,
        carrying_dimension_width: reqBody.carrying_dimension_width,
        carrying_dimension_height: reqBody.carrying_dimension_height,
        is_smoking: reqBody.is_smoking,
        insurance_no: reqBody.insurance_no,
        insurance_certificate: certification,
        images: car_images,
      };
      const created = await new UserVehicle(jsonData).save();
      return res.send({
        status: true,
        data: created._id,
        message: "Car Added Successfully.",
      });
    } catch (error) {
      return res.send({ status: false, message: error.message });
    }
  },

  updateVehicle: async (req, res, next) => {
    try {
      const reqBody = req.body;
      const car_images = [];
      let certification;

      if (req.files.length > 0) {
        for (let i = 0; i < req.files.length; i++) {
          let fieldname = req.files[i].fieldname;
          if (fieldname == "images") {
            car_images.push(req.files[i].location);
          }

          if (fieldname == "insurance_certificate") {
            certification = req.files[0].location;
          }
        }
      }

      const jsonData = {
        user_id: reqBody.user_id,
        model_id: reqBody.model_id,
        year: reqBody.year,
        colour: reqBody.colour,
        seat_available: reqBody.seat_available,
        carrying_capacity: reqBody.carrying_capacity,
        carrying_dimension_width: reqBody.carrying_dimension_width,
        carrying_dimension_height: reqBody.carrying_dimension_height,
        is_smoking: reqBody.is_smoking,
        insurance_no: reqBody.insurance_no,
      };

      if (certification) {
        jsonData["insurance_certificate"] = certification;
      }

      const isVehicle = await UserVehicle.findById(reqBody.vehicle_id);

      if (!isVehicle) {
        return res.send({
          status: false,
          message: "Vehicle data not found for this id",
        });
      }

      if (car_images.length > 0) {
        isVehicle.images.map((item) => {
          car_images.push(item);
        });
        jsonData["images"] = car_images;
      }

      const isUser = await UserLogins.findById(isVehicle.user_id);

      if (!isUser) {
        return res.send({ status: false, message: "User not found" });
      }

      await UserVehicle.findByIdAndUpdate(reqBody.vehicle_id, jsonData);

      return res.send({
        status: true,
        message: "Vehicle updated successfully..",
      });
    } catch (error) {
      console.log(error.message);
      return res.status(400).send({ status: false, message: error.message });
    }
  },

  deleteVehicleImage: async (req, res, next) => {
    try {
      const { filename, vehicle_id, type } = req.body;

      const s3 = new aws.S3();
      const bucketName = process.env.S3_BUCKET_NAME;
      let imgName = filename.split("/").pop();
      const params = {
        Bucket: bucketName,
        Key: `public_asset/${imgName}`,
      };

      s3.deleteObject(params, (error, data) => {
        if (error) {
          res.status(500).send(error);
        }
        console.log("File has been deleted successfully");
      });

      let userVehicle = await UserVehicle.findById(vehicle_id).then(
        (vehicle) => {
          if (type == "insurance") {
            vehicle.insurance_certificate = "";
          }

          let arr = vehicle.images.filter((item) => item != filename);
          vehicle.images = arr;
          vehicle.save();
        }
      );

      return res.send({
        status: true,
        message: "File has been deleted successfully..",
      });
    } catch (error) {
      console.log("error ---------->" + error.message);
      return res.status(400).send({ status: false, message: error.message });
    }
  },

  updateprofile: async (req, res, next) => {
    const { name, user_background } = req.body;

    if (!name) {
      res.send({ status: false, message: "Required Parameter is missing" });
      return;
    }

    console.log("req.user._id");
    let user_id = req.body.user_id;

    UserLogins.findOne({ _id: user_id }).then((data) => {
      if (data && data._id) {
        req.body["updated"] = new Date();

        let avatar = null;
        const data = {
          name: req.body.name,
          user_background: user_background,
        };
        if (req.files && req.files[0] && req.files[0].location) {
          data["avatar"] = req.files[0].location;
        }

        UserLogins.updateOne({ _id: user_id }, data)
          .then((data) => {
            return res.send({ status: 200, data });
          })
          .catch((err) => {
            return res.send({ status: 400, message: err.errmsg });
          });
      }
      // else {
      //     Profile.create(req.body).then((data) => {
      //         res.send({ status: true, data })
      //         return;
      //     }).catch((err) => {
      //         res.send({ status: false, message: err.errmsg })
      //         return;
      //     });
      // }
    });
  },

  getVehicle: async (req, res, next) => {
    var user_id = req.body.user_id;
    try {
      let data = await UserVehicle.findOne({ user_id: user_id })
        .populate("user_id")
        .populate("model_id")
        .lean()
        .exec();

      // const data = await UserVehicle.aggregate([
      //     { $match: { user_id: mongoose.Types.ObjectId(user_id) } },
      //     {
      //         $lookup:
      //         {
      //             from: 'car_models',
      //             localField: 'vehicle_id',
      //             foreignField: '_id',
      //             as: 'model_id'
      //         }
      //     },
      // ]);

      // console.log(data)

      let reviews = await Review.find({ driver_id: user_id });

      return res
        .status(200)
        .send({
          status: 200,
          data,
          reviews,
          message: "Trip data get successfully",
        });
    } catch (e) {
      console.log("error---------------", e);
      return res.status(400).send({ status: 400, message: e.message });
    }
  },

  getUserDetail: async (req, res, next) => {
    try {
      let user = await UserLogins.findById(req.body.user_id).lean().exec();

      let reviews = await Review.find({ driver_id: user._id })
        .select("rating")
        .lean()
        .exec();
      let totalRating = 0;
      if (reviews.length > 0) {
        totalRating = await Helper.getReviewRatingCalculate(reviews);
      }

      let reviewsData = await Review.find({ driver_id: user._id })

      user["totalRating"] = totalRating;
      return res.status(200).send({ status: true, user: user, reviews: reviewsData });
    } catch (e) {
      return res.status(400).send({ status: true, message: e.message });
    }
  },

  getprofile: async (req, res, next) => {
    try {
      const profileId = req.body.profile_id;

      if (!profileId) {
        return res.send({ status: false, message: "Profile Id is required" });
      }

      let profile = await UserLogins.findById(profileId).lean().exec();

      if (!profile) {
        return res.send({ status: false, message: "User not found" });
      }

      const user = await UserLogins.findOne({ _id: profileId }).exec();

      profile.name = user.username;

      return res.send({ status: true, userLogin: user, profile });
    } catch (error) {
      return res.send({ status: false, message: error.message });
    }
  },

  createaddress: (req, res, next) => {
    const {
      email,
      isdefault,
      companyname,
      phone,
      fname,
      lname,
      country,
      add1,
      add2,
      state,
      postal,
      isbilling,
      isshipping,
      city,
    } = req.body;

    const loginid = req.user._id;

    // return false
    let isEmpty = notEmpty({
      phone,
      fname,
      lname,
      country,
      add1,
      state,
      postal,
    });
    if (!isEmpty) {
      res.send({
        status: false,
        message: "Required Parameter is missing",
        isEmpty,
      });
      return;
    }

    let ad = {
      isdefault,
      phone,
      fname,
      lname,
      country,
      add1,
      state,
      postal,
      loginid,
      city,
    };

    if (companyname) ad["companyname"] = companyname;

    if (add2) ad["add2"] = add2;

    if (email) ad["email"] = email;

    Address.create(ad)
      .then((data) => {
        if (isdefault == 1 || isdefault == true) {
          Address.updateMany(
            { loginid: req.user._id },
            { isshipping: 0, isbilling: 0, isdefault: 0 }
          ).then((u) => {
            Address.updateOne({ _id: data._id }, { isdefault: 1 }).then(
              (data) => {
                res.send({ status: true, data });
                return;
              }
            );
          });
        } else {
          res.send({ status: true, data });
          return;
        }
      })
      .catch((err) => {
        res.send({ status: false, message: err.errmsg });
        return;
      });
  },

  updateaddress: (req, res, next) => {
    const {
      _id,
      isdefault,
      email,
      companyname,
      phone,
      fname,
      lname,
      country,
      add1,
      add2,
      state,
      postal,
      isbilling,
      isshipping,
      city,
    } = req.body;
    // console.log(req.body)

    if (!_id || _id == "") {
      res.send({ status: false, message: "missing required params" });
      return;
    }

    let ad = {
      isdefault,
      city,
      add2,
      email,
      companyname,
      isbilling,
      isshipping,
      phone,
      fname,
      lname,
      country,
      add1,
      state,
      postal,
      loginid: req.user._id,
      updated: new Date(),
    };

    // my code
    if (req.body.isdefault == 1) {
      Address.updateMany(
        { loginid: req.user._id },
        { isshipping: 0, isbilling: 0, isdefault: 0 }
      )
        .then((data) => {
          Address.updateOne({ _id: _id }, ad).then((data) => {
            res.send({ status: true, data });
            return;
          });
        })
        .catch((err) => {
          res.send({ status: false, message: err.errmsg });
          return;
        });
    } else {
      req.body.isdefault == 1 ? (ad.isdefault = 0) : (ad.isdefault = 1);
      Address.updateOne({ _id: _id }, ad)
        .then((data) => {
          res.send({ status: true, data });
          return;
        })
        .catch((err) => {
          res.send({ status: false, message: err.errmsg });
          return;
        });
    }

    // my code end
  },

  getaddresses: (req, res, next) => {
    Address.find({ loginid: req.user._id })
      .then((data) => {
        data = data.sort((i, j) => {
          if (i.isdefault > j.isdefault) {
            return -1;
          } else {
            return 1;
          }
        });
        res.send({ status: true, data });
        return;
      })
      .catch((err) => {
        res.send({ status: false, message: err.errmsg });
        return;
      });
  },

  setdefaultshipping: (req, res, next) => {
    const { _id } = req.body;

    if (!_id || _id == "") {
      res.send({ status: false, message: "missing required params" });
      return;
    }
    Address.update({ loginid: req.user._id }, { isshipping: 0 }).then(
      (data) => {
        Address.update({ _id: _id }, { isshipping: 1 })
          .then((data) => {
            res.send({ status: true, data });
            return;
          })
          .catch((err) => {
            res.send({ status: false, message: err.errmsg });
            return;
          });
      }
    );
  },

  setMobileIsVerified: async (req, res, next) => {
    try {
      let { otp, mobile } = req.body;

      let userOtpCheck = await UserLogins.findOne({
        mobile_number: mobile,
        mobile_otp: otp,
      });

      // console.log(userOtpCheck);
      // return ;

      if (userOtpCheck) {
        let user = await UserLogins.update(
          { mobile_number: mobile, mobile_otp: otp },
          { isMobileVerified: true }
        );
        return res.send({
          status: true,
          message: "Mobile number verified successfully.",
        });
      } else {
        return res.send({ status: false, message: "Please enter valid OTP." });
      }
    } catch (err) {
      res.send({ status: false, message: err.errmsg });
    }
  },

  deleteaddress: (req, res, next) => {
    const { _id } = req.body;

    if (!_id || _id == "") {
      res.send({ status: false, message: "missing required params" });
      return;
    }

    Address.deleteOne({ _id: _id })
      .then((data) => {
        res.send({ status: true, data });
        return;
      })
      .catch((err) => {
        res.send({ status: false, message: err.errmsg });
        return;
      });
  },

  setdefaultbilling: (req, res, next) => {
    const { _id } = req.body;

    if (!_id || _id == "") {
      res.send({ status: false, message: "missing required params" });
      return;
    }
    Address.update({ loginid: req.user._id }, { isbilling: 0 }).then((data) => {
      Address.update({ _id: _id }, { isbilling: 1 })
        .then((data) => {
          res.send({ status: true, data });
          return;
        })
        .catch((err) => {
          res.send({ status: false, message: err.errmsg });
          return;
        });
    });
  },

  contactUs: async (req, res, next) => {
    try {
      if (
        typeof req.body.name !== "undefined" &&
        typeof req.body.email !== "undefined" &&
        typeof req.body.subject !== "undefined" &&
        typeof req.body.message !== "undefined"
      ) {
        let data = {
          name: req.body.name,
          email: req.body.email,
          subject: req.body.subject,
          message: req.body.message,
        };
        Contact.create(data)
          .then((user) => {
            var mailOptions = {
              from: "no-reply@gmail.com",
              to: adminEmail,
              subject: "Contact Us",
              text: `${JSON.stringify(data)}`,
            };
            transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                console.log(error);
              } else {
                console.log("Email sent: " + info.response);
              }
            });
            res.send({ status: true, result: user });
            return;
          })
          .catch((err) => {
            res.send({ status: false, message: "Something went wrong!" });
          });
      } else {
        res.send({ status: false, message: "Enter all required fields!" });
      }
    } catch (e) {
      res.send({ status: false, message: e.message });
    }
  },
  contactUsList: async (req, res, next) => {
    try {
      let data = await Contact.find({});

      return res.send({
        status: true,
        data: data,
        message: "Contact List get successfully",
      });
    } catch (e) {
      res.send({ status: false, message: e.message });
    }
  },

  loginHistory: async (req, res, next) => {
    try {
      const reqBody = req.body;
      const Limit = parseInt(reqBody.limit) || 10;
      const PageNo = parseInt(reqBody.pageno) || 0;
      const data = await UserLogins.aggregate([
        {
          $lookup: {
            from: "profiles",
            localField: "_id",
            foreignField: "loginid",
            as: "profileInfo",
          },
        },
        { $unwind: { path: "$profileInfo", preserveNullAndEmptyArrays: true } },
        { $skip: PageNo * Limit },
        { $limit: Limit },
        {
          $project: {
            _id: 1,
            type_login: 1,
            ip_address: 1,
            no_of_loggedin: 1,
            last_login_time: 1,
            email: 1,
            roles: 1,
            mobile_number: 1,
            "profileInfo.name": 1,
          },
        },
      ]);
      return res.send({
        status: true,
        result: data,
        total: data.length,
        message: " get login history successfully",
      });
    } catch (error) {
      return res.send({ status: false, message: error.message });
    }
  },

  logout: (req, res, next) => {
    try {
      if (req.user) {
        req.user = null;
        return res.send({ status: true, message: "Logout Successfully" });
      }
    } catch (error) {
      return res.send({ status: false, message: error.message });
    }
  },
};

function generateOTP() {
  var digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < 4; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}
