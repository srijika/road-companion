const db = require('../_helper/db');

const otp = db.Otp;
const FriendRequest = db.FriendRequest;
const accessTokenSecret = require('../config.json').jwd_secret;
var ROLES = require('../config.json').ROLES;
const jwt = require('jsonwebtoken');
let mongoose = require('mongoose')
var request = require('request');
const Helper = require('../core/helper');
var path = require('path');
var fs = require('fs');
var request = require('request');
;

let saltRounds = 10;


module.exports = {

    sendfriendrequest: async (req, res, next) => {

        try{

            const {
                sender_id,
                reciever_id
            } = req.body;

            const d = new Date();
            // validation 
            if (!sender_id)
            return res.send({ status: 400, message: "Sender Id is required" });
            if (!reciever_id)
            return res.send({ status: 400, message: "Reciever Id is required" });

            const data = {
                sender_id : sender_id,
                reciever_id : reciever_id,
                send_date: d,
                accepted_date: null 
                
            };

            const isRequest = await FriendRequest
            .findOne({ $and: [{ sender_id: sender_id }, { reciever_id: reciever_id }] })
            .lean().exec();

            if(isRequest){
                return res.send({ status: 400, message: 'Request Already Sent!' });
            }
            const FriendRequestCreate = await (new FriendRequest(data)).save();
            return res.send({ status: 200, message: 'Friend Request sent successfully' });


        }
        catch (error) {

            return res.send({ status: 400, message: error.message })
        }
        

    },
    acceptfriendrequest: async (req, res, next) => {

        try{

            const {
                accepter_id,
                requester_id,
                accept_status,
            } = req.body;

            const d = new Date();
            // validation 
            if (!requester_id)
            return res.send({ status: 400, message: "Requester Id is required" });
            if (!accepter_id)
            return res.send({ status: 400, message: "Accepter Id is required" });
            
            
            // if request accepted
            if(accept_status){

                FriendRequest.findOne({ $and: [{ sender_id: requester_id }, { reciever_id: accepter_id }] }).then((data) => {
                    FriendRequest.updateOne({ _id: data._id }, { $set: { accepted_date: d, accept_status:true } }).then(async data2 => {
                        return res.send({ status: 200, message: "Friend Request Accepted" });
                    });
                }).catch(err => {
                    return res.send({ status: 400, message: "Record not found!" })
                   
                })
         

            }else{

                const deleted = await FriendRequest.findOneAndRemove({ $and: [{ sender_id: requester_id }, { reciever_id: accepter_id }] }).lean().exec();
                return res.send({ status: 200, message: "Friend Request Rejected" });
            }
        }
        catch (error) {

            return res.send({ status: 400, message: error.message })
        }
        

    },

    deletefriendrequest: async (req, res, next) => {

        try{

            const {
                sender_id,
                reciever_id,
              
            } = req.body;

         
            // validation 
            if (!sender_id)
            return res.send({ status: 400, message: "Sender Id is required" });
            if (!reciever_id)
            return res.send({ status: 400, message: "Reciever Id is required" });

            FriendRequest.findOneAndRemove({ $and: [{ sender_id: sender_id }, { reciever_id: reciever_id }] }).then((data) => {
               
                return res.send({ status: 200, message: "Friend Request Deleted" });

            }).catch(err => {
            return res.send({ status: 400, message: "Record not found!" })
            
            });
               
          
        }
        catch (error) {

            return res.send({ status: 400, message: error.message })
        }


    }
   
}


function generateOTP() {

    var digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 4; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}
