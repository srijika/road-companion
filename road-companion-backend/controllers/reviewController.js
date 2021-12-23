const { Blog  , Shop, Review} = require('../_helper/db');
var path = require('path');
var fs = require('fs');
const mongoose = require('mongoose');


module.exports = {

createShopReview: async (req, res, next) => {
    try {
   
            const reqBody = req.body;
            if (!reqBody.user_id) {
                return res.send({ status: 400, message: 'user_id is required' });
            }
            const reviewsModel = new Review(reqBody);
               const created = await reviewsModel.save();
               return res.send({ status: 200,  message: 'Review Add successfully' });
   
           } catch (error) {
   
               console.log(error)
               return res.send({ status: 400, message: error.message });
           }
       },

       
    deleteShopReview: async (req, res, next) => {
        try {
            const { _id} = req.body;
          if (!_id) {
                return res.send({ status: 400, message: '_id is required' });
            }  
            const deleted = await Shop.findOneAndRemove({ _id : req.body._id}).lean().exec();
 
            return res.send({ status: 200, message: 'Review deleted successfully' });
    
        } catch (error) {
            return res.send({ status: 400, message: error.message });
        }
    },


}


