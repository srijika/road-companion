const { Tag, Shop, ServiceTag, UserLogins } = require('../_helper/db');
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
    createShop: async (req, res, next) => {


        try {

            const { shop_name, user_id, shop_location, is_mobile_appointment, is_location_access, longitude, lattitude, tag } = req.body;
            let shop_photo = null;
            let tags = []
            if (typeof (tag) == "string" || typeof (tag) == "String") {
                let tagCovert = JSON.parse(tag)
                let filterPrice = tagCovert.filter((val) => {
                    return val.tag_price !== 0;
                })


                tags = filterPrice
            } else {
                tags = tag

            }

            if (req.files[0].location && req.files[0].location != 'undefined') {
                shop_photo = req.files[0].location;
            }

            const data = {
                shop_name,
                user_id,
                shop_location,
                is_mobile_appointment,
                is_location_access,
                lattitude,
                longitude,
                location: {
                    "type": "Point",
                    "coordinates": [
                        lattitude,
                        longitude
                    ]
                },
                shop_photo: shop_photo

            }
            let findShop = await Shop.find({ shop_name })
            if (findShop.length > 0) {
                res.send({ status: 400, message: "Shop Already Exits" });
                return false;
            }



            const shopModel = new Shop(data);
            const created = await shopModel.save();

            //Add Service
            tags && tags.map(async (data) => {
                const serTagAdd = new ServiceTag({
                    tag_id: data.tag_id,
                    user_id: user_id,
                    tag_price: data.tag_price
                });
                await serTagAdd.save();
            })
            const response = { "_id": created._id, "shop_image": created.shop_image };
            return res.send({ status: 200, data: response, message: 'Shop created successfully' });

        } catch (error) {


            return res.send({ status: 400, message: error.message });
        }
    },



    updateShop: async (req, res, next) => {
        try {
            const reqBody = req.body;
            const Id = reqBody._id;
            const userId = reqBody.user_id;

            let findShop = await Shop.find({ _id: { $ne: Id }, shop_name: req.body.shop_name });

            if (findShop.length > 0) {
                res.send({ status: 400, message: "Shop Already Exits" });
                return false;
            }

            if (!Id) {
                return res.send({ status: 400, message: 'Id is required' });
            }
            if (!userId) {
                return res.send({ status: 400, message: 'userId is required' });
            }

            await Shop.findByIdAndUpdate(Id, reqBody).lean().exec();

            return res.send({ status: 200, message: 'Shop updated successfully' });

        } catch (error) {
            return res.send({ status: 400, message: error.message });
        }
    },

    getBarberShop: async (req, res, next) => {
        try {
            const { user_id } = req.body;

            if (!user_id) {
                return res.send({ status: 400, message: 'user_id is required' });
            }

            const shops = await Shop.find({ user_id: req.body.user_id })


            if (shops.length === 0) {
                return res.send({ status: 400, message: 'Shop not fount ' });
            }

            return res.send({ status: 200, data: shops, message: 'Shop get successfully' });

        } catch (error) {


            return res.send({ status: 400, message: error.message });
        }
    },

    getBarberShopByLocation: async (req, res, next) => {

        try {

            let { lattitude, longitude } = req.body;

            let nearbyShops = await Shop.find({
                location: {
                    $near: {
                        $maxDistance: 3000,
                        $geometry: {
                            type: "Point",
                            coordinates: [lattitude, longitude]
                        }
                    }
                }
            }).select("-location").lean().exec();


            const nearbyShops2 = await Promise.all(nearbyShops.map(async (item) => {
                let services = await ServiceTag.find({ user_id: item.user_id }).lean().exec();
                let rangeArray = [];
                services.map(async (service) => {
                    return rangeArray.push(service.tag_price);
                })

                const max = Math.max.apply(Math, rangeArray);
                const min = Math.min.apply(Math, rangeArray);

                item['max_price'] = max;
                item['min_price'] = min;
                return item;

            })
            );

            return res.status(200).send({ status: 200, nearbyShops2 });

        } catch (error) {
            return res.send({ status: 400, message: error.message });
        }

    },

    deleteShop: async (req, res, next) => {
        try {
            const { user_id, _id } = req.body;


            if (!user_id) {
                return res.send({ status: 400, message: 'user_id is required' });
            }
            if (!_id) {
                return res.send({ status: 400, message: '_id is required' });
            }


            const deleted = await Shop.findOneAndRemove({ user_id: req.body.user_id, _id: req.body._id }).lean().exec();

            if (!deleted) {
                return res.send({ status: 400, message: 'Shop not found' });
            }

            return res.send({ status: 200, message: 'Shop deleted successfully' });

        } catch (error) {
            return res.send({ status: 400, message: error.message });
        }
    },

    getShopReview: async (req, res, next) => {
        try {
            //   const getShopReview = 
            const getShopReview = await Shop.aggregate([
                { $lookup: { from: 'shop_reviews', localField: '_id', foreignField: 'shop_id', as: 'shopReview' } },

            ]);


            res.send({ status: 200, shopReview: getShopReview, message: "Get Successfully" });



        } catch (error) {


            return res.send({ status: 400, message: error.message });
        }
    },

    getBarberShopInfo: async (req, res, next) => {

        try {

            let { user_id } = req.body;
            let condition = { user_id: mongoose.Types.ObjectId(user_id) };
            const getShopDetails = await Shop.aggregate([
                { $match: condition },
                { $lookup: { from: 'users', localField: 'user_id', foreignField: '_id', as: 'userInfo' } },
                { $unwind: "$userInfo" },

            ]);
            const getTagWithPrice = await ServiceTag.aggregate([
                { $match: condition },
                { $lookup: { from: 'tags', localField: 'tag_id', foreignField: '_id', as: 'serviceInfo' } },
                { $unwind: "$serviceInfo" },
                {
                    $project: {
                        tag_price: 1,
                        'tag_name': "$serviceInfo.tag_name",

                    }
                },
            ]);
            //insert Price Array
            getShopDetails[0].servicePrice = getTagWithPrice
            return res.status(200).send({ status: 200, getShopDetails });

        } catch (error) {


            return res.send({ status: 400, message: error.message });
        }

    },
    getBarberShopById: async (req, res, next) => {

        try {
            let { shop_id } = req.body;

            let findShop = await Shop.find({ _id: shop_id })
            if (findShop.length === 0) {
                res.send({ status: 400, message: "Shop Not Found" });
                return false;
            }

            let condition = { _id: mongoose.Types.ObjectId(shop_id) };

            const getShopDetails = await Shop.aggregate([
                { $match: condition },
                { $lookup: { from: 'users', localField: 'user_id', foreignField: '_id', as: 'userInfo' } },
                { $unwind: "$userInfo" },
                {
                    $project: {
                        status: 1,
                        id: 1,
                        shop_name: 1,
                        user_id: 1,
                        shop_location: 1,
                        is_mobile_appointment: 1,
                        isEmailVerified: 1,
                        is_location_access: 1,
                        is_location_access: 1,

                        lattitude: 1,

                        longitude: 1,
                        shop_image: 1,



                    }
                },



            ]);

            let user_id = getShopDetails[0].user_id;



            let conditions = { user_id: mongoose.Types.ObjectId(user_id) };


            const getTagWithPrice = await ServiceTag.aggregate([
                { $match: conditions },
                { $lookup: { from: 'tags', localField: 'tag_id', foreignField: '_id', as: 'serviceInfo' } },
                { $unwind: "$serviceInfo" },
                {
                    $project: {
                        tag_price: 1,
                        'tag_name': "$serviceInfo.tag_name",

                    }
                },
            ]);
            //insert Price Array
            getShopDetails[0].servicePrice = getTagWithPrice
            return res.status(200).send({ status: 200, getShopDetails: getShopDetails[0] });

        } catch (error) {


            return res.send({ status: 400, message: error.message });
        }

    },


}
