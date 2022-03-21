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


    updateReview: async (req, res, next) => {
        try {
            const reqBody = req.body;
            const Id = reqBody._id;

            if (!Id) {
                return res.send({ status: false, message: 'Id is required' });
            }
             await Review.findByIdAndUpdate(Id, reqBody).lean().exec();
             return res.send({ status: true, message: 'Review Updated successfully' });
    
        } catch (error) {
            return res.send({ status: false, message: error.message });
        }
    },


    getDriverReview: async (req, res, next) => {
        try {
            const reqQuery = req.query;
            const slug = reqQuery.user_id;
            
            let reviews = await Review.find({ driver_id: slug }).populate('reviewer_id').lean().exec();
           
            return res.send({ status: 200, data: reviews });
        } catch (error) {

            console.log(error)
            return res.send({ status: 400, message: error.message });
        }
    },

    reviewDetail: async (req, res, next) => {
        try {
            const reqQuery = req.query;
            console.log(reqQuery) ;
            const slug = reqQuery.slug;
            
           let review = await Review.findOne({ _id: slug }).lean().exec();
           
            return res.send({ status: 200, data: review });
        } catch (error) {

            console.log(error)
            return res.send({ status: 400, message: error.message });
        }
    },

    



    deleteReview: async (req, res, next) => {
        try {
            const reqQuery = req.query;
            const slug = reqQuery.slug;
            if (!slug) {
                return res.send({ status: 400, message: '_id is required' });
            }
            const deleted = await Review.findOneAndRemove({ _id: slug }).lean().exec();

            return res.send({ status: 200, message: 'Review deleted successfully' });

        } catch (error) {
            return res.send({ status: 400, message: error.message });
        }
    },


    reviewStatus: async (req, res, next) => {
        try {
            let { id } = req.body;

            Review.findById(id, function (err, data) {
                data.status = data.status == 'Activate' ? 'Deactivate' :'Activate' ;
                data.save((err, result) => {
                    if (result) {
                        return res.send({ status: true, message: "User action changed successfully" });
                    } else {
                        return res.send({ status: false, message: err });
                    }
                })
            });

        } catch (e) {
            console.log(e);
            return res.send({ status: false, message: e.message });
        }
    },


}


