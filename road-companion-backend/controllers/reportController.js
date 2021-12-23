const { Tag , ServiceTag , PostReport , UserLogins} = require('../_helper/db');
var path = require('path');
var fs = require('fs');
const mongoose = require('mongoose');


module.exports = {

    createPostReport: async (req, res, next) => {
 try {
const {post_id , user_id , report_reason} = req.body;
const reqBody = req.body;

    if (!post_id) {
        return res.send({ status: 400, message: 'post_id is required' });
    }

    if (!user_id) {
        return res.send({ status: 400, message: 'user_id is required' });
    }
  
    if (!report_reason) {
        return res.send({ status: 400, message: 'report_reason is required' });
    }
  
  

            const reportModel = new PostReport(reqBody);
            const created = await reportModel.save();
            return res.send({ status: 200, message: 'Report created successfully' });

        } catch (error) {

            console.log(error)
            return res.send({ status: 400, message: error.message });
        }
    },

  
    getAllPostReport: async (req, res, next) => {
        try {

            

            let _id = req.body._id;
            const reqBody = req.body;
        
        
        
                    const Limit = reqBody.limit ? parseInt(reqBody.limit) : 10; 
                    const PageNo = reqBody.page ? parseInt(reqBody.page) : 0;
        
        
                    const postReports = await PostReport.find().populate("user_id", "username").sort({ updated_at: -1 }).skip(Limit * PageNo).limit(Limit).lean().exec();
     

console.log("postReportss" ,postReports)
                    const count = await Tag.count();
                    return res.send({ status: true, data: postReports, count: count, message: 'Post Reports List get successfully'  ,   });

        } catch (error) {
    
            
            return res.send({ status: false, message: error.message });
        }
    },

    getUserPostReport: async (req, res, next) => {
        try {
      
            const postReports = await PostReport.find({user_id : req.body_id});
            return res.send({ status: 200, data: postReports, message:'Get User Post Reports successfully' });
    
        } catch (error) {
    
            
            return res.send({ status: 400, message: error.message });
        }
    },


    
    deletePostReport: async (req, res, next) => {
    try {
        const { _id} = req.body;


     
        if (!_id) {
            return res.send({ status: false, message: '_id is required' });
        }


        const deleted = await PostReport.findOneAndRemove({ _id : req.body._id}).lean().exec();

        if (!deleted) {
            return res.send({ status: false, message: 'Post Report not found' });
        }

        return res.send({ status: true, message: 'Report deleted successfully' });

    } catch (error) {
        return res.send({ status: false, message: error.message });
    }
},



//User Services Models

createServiceTag: async (req, res, next) => {
    try {
   
   const reqBody = req.body;
   const { tag_id, user_id , tag_price} = req.body;


     
   if (!tag_id) {
       return res.send({ status: 400, message: 'tag_id is required' });
   }
   if (!user_id) {
    return res.send({ status: 400, message: 'user_id is required' });
}
if (!tag_price) {
    return res.send({ status: 400, message: 'tag_price is required' });
}

               const userServiceTagModel = new ServiceTag(reqBody);
               const created = await userServiceTagModel.save();
               return res.send({ status: 200, message: 'User ServiceTag created successfully' });
   
           } catch (error) {
   
               console.log(error)
               return res.send({ status: 400, message: error.message });
           }
       },
   

       updateServiceTag: async (req, res, next) => {
        try {
            const reqBody = req.body;
            const Id = reqBody._id;
            const tag_price = reqBody.tag_price;
            let data = { tag_price}


            if (!Id) {
                return res.send({ status: 400, message: 'Id is required' });
            }


            await ServiceTag.findByIdAndUpdate(Id, data).lean().exec();

    
            return res.send({ status: 200, message: 'User ServiceTag Updated successfully' });
    
        } catch (error) {
            return res.send({ status: 400, message: error.message });
        }
    },

    deleteServiceTag: async (req, res, next) => {
        try {
            const { _id} = req.body;

            if (!_id) {
                return res.send({ status: 400, message: '_id is required' });
            }
    
    
            const deleted = await ServiceTag.findOneAndRemove({ _id : req.body._id}).lean().exec();
    
            if (!deleted) {
                return res.send({ status: 400, message: 'User ServiceTag not found' });
            }
    
            return res.send({ status: 200, message: 'User ServiceTag deleted successfully' });
    
        } catch (error) {
            return res.send({ status: 400, message: error.message });
        }
    },

    getUserServiceTag: async (req, res, next) => {
        try {

            if (!req.body.user_id) {
                return res.send({ status: 400, message: 'user_id is required' });
            }
      
            const userServiceTags = await ServiceTag.find({user_id : req.body.user_id});
            console.log(userServiceTags)
            return res.send({ status: 200, data: userServiceTags, message:'User ServiceTag get successfully' });
    
        } catch (error) {
    
            
            return res.send({ status: 400, message: error.message });
        }
    },

    
    
}

