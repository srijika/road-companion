const { Blog, Shop, Review } = require('../_helper/db');
var path = require('path');
var fs = require('fs');
const mongoose = require('mongoose');


module.exports = {

    addReview: async (req, res, next) => {
        try {

            const reqBody = req.body;
            let review = await new Review(reqBody).save();

            return res.send({ status: 200, message: 'Review Add successfully' });
        } catch (error) {

            console.log(error)
            return res.send({ status: 400, message: error.message });
        }
    },


    getDriverReview: async (req, res, next) => {
        try {
            const reqBody = req.body;
            let reviews = await new Review.find({ driver_id: reqBody.user_id }).lean().exec();

            return res.send({ status: 200, data: reviews });
        } catch (error) {

            console.log(error)
            return res.send({ status: 400, message: error.message });
        }
    },



    deleteShopReview: async (req, res, next) => {
        try {
            const { _id } = req.body;
            if (!_id) {
                return res.send({ status: 400, message: '_id is required' });
            }
            const deleted = await Shop.findOneAndRemove({ _id: req.body._id }).lean().exec();

            return res.send({ status: 200, message: 'Review deleted successfully' });

        } catch (error) {
            return res.send({ status: 400, message: error.message });
        }
    },


}


