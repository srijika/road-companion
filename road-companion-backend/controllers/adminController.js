const db = require('../_helper/db');
const Product = db.Product;
const UserLogins = db.UserLogins;
var ROLES = require('../config.json').ROLES;
var fs = require('fs');
var path = require('path');
let moment = require('moment');



exports.dashBoard = async (req, res, next) => {

    try {
        const reqBody = req.body;
      console.log("reqBody.user_id", reqBody.user_id)
      let user_id = reqBody.user_id
        
        const Total_Users = await UserLogins.find().count();
        const get_UserInfo = await UserLogins.findOne({_id : user_id})
        const DBdata = {
            GetTotalUsers: Total_Users,
            get_UserInfo : get_UserInfo

        };
         return res.send({
            status: true,
            countData: DBdata,
          
        });
    } catch (e) {
        res.send({ status: false, message: e.message })
    }
}
