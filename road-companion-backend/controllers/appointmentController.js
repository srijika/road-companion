const { Appointment, ServiceTag } = require('../_helper/db');
var path = require('path');
var fs = require('fs');
const mongoose = require('mongoose');


module.exports = {

    createUserAppointment: async (req, res, next) => {
        try {
            const { shop_id, user_id, service_tags , appointment_date} = req.body;

            let serviceTags = []
            if (typeof(service_tags) == "string" || typeof(service_tags) == "String"){
                      let serviceCovert = JSON.parse(service_tags)
                                
     
            serviceTags = serviceCovert
            }else{
                serviceTags = service_tags
     
            }
       

            if (!shop_id) {
                return res.send({ status: 400, message: 'shop_id is required' });
            }

            if (!user_id) {
                return res.send({ status: 400, message: 'user_id is required' });
            }

            if (!service_tags || service_tags.length <= 0) {
                return res.send({ status: 400, message: 'service_tags is required' });
            }




            let serviceArray = serviceTags.map((id) => { return id.service_id }
            )
            

         
            let getServiceTotal = null;
            if(serviceArray.length > 1){
                const getService = await ServiceTag.find({ '_id': { $in: serviceArray } });
                
                getServiceTotal = getService.reduce((acc, val) => {
                    return acc.tag_price += val.tag_price
                })
            }else{
               let _id = serviceArray[0];
                const getService = await ServiceTag.find({ _id  });
                 getServiceTotal = getService[0].tag_price;
            }


            const result = {
                shop_id: shop_id,
                user_id: user_id,
                service_tags: serviceTags,
                status: "pending",
                appointment_date: appointment_date,
                totalAmt: getServiceTotal

            }

            const reportModel = new Appointment(result);
            const created = await reportModel.save();
            return res.send({ status: 200, message: 'Appointment created successfully' });

        } catch (error) {

            console.log(error)
            return res.send({ status: 400, message: error.message });
        }
    },


    getAppointmentList: async (req, res, next) => {
        try {

            const AppointmentList = await Appointment.find();
            return res.send({ status: 200, data: AppointmentList, message: 'AppointmentList get successfully' });

        } catch (error) {

            return res.send({ status: 400, message: error.message });
        }
    },




    updateAppointmentStatus: async (req, res, next) => {
        try {
            const reqBody = req.body;
            const Id = reqBody._id;

            let data = { status: reqBody.status === "true" ? "accepted" : "rejected" };



            if (!Id) {
                return res.send({ status: 400, message: 'Id is required' });
            }


            await Appointment.findByIdAndUpdate(Id, data).lean().exec();


            return res.send({ status: 200, message: 'Appointment Status Updated successfully' });

        } catch (error) {
            return res.send({ status: 400, message: error.message });
        }
    },

    getAppointmentListByBarber: async (req, res, next) => {
        try {


            const { user_id } = req.body;

            console.log(user_id)
            const AppointmentList = await Appointment.find();
            return res.send({ status: 200, data: AppointmentList, message: 'AppointmentList get successfully' });

        } catch (error) {

            return res.send({ status: 400, message: error.message });
        }
    },
    getAppointmentListUser: async (req, res, next) => {
        try {


            const { user_id } = req.body;

            const AppointmentList = await Appointment.find({user_id});
            return res.send({ status: 200, data: AppointmentList, message: 'Get User AppointmentList successfully' });

        } catch (error) {

            return res.send({ status: 400, message: error.message });
        }
    },

}

