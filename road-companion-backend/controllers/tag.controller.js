const { Tag , ServiceTag} = require('../_helper/db');
var path = require('path');
var fs = require('fs');
const mongoose = require('mongoose');


module.exports = {

    //Tags Model
    createTag: async (req, res, next) => {
 try {

const {tag_name} = req.body;
const reqBody = req.body;


            let findTag = await Tag.find({tag_name})
            if(findTag.length > 0){
                res.send({ status: false, message: "Tag Already Exits"});
                return false;
            }
            const tagModel = new Tag(reqBody);
            const created = await tagModel.save();
            return res.send({ status: true, message: 'Tag created successfully' });

        } catch (error) {

            console.log(error)
            return res.send({ status: false, message: error.message });
        }
    },

    updateTag: async (req, res, next) => {
        try {

            const reqBody = req.body;
            const Id = reqBody._id;
            if (!Id) {
                return res.send({ status: false, message: 'Id is required' });
            }
          
            let findTag = await Tag.find( {_id: {$ne: Id} ,tag_name: req.body.tag_name });

            if(findTag.length > 0){
                res.send({ status: false, message: "Tag Already Exits"});
                return false;
            }

       

            await Tag.findByIdAndUpdate(Id, reqBody).lean().exec();
    
            return res.send({ status: true, message: 'Tag updated successfully' });
    
        } catch (error) {
            return res.send({ status: false, message: error.message });
        }
    },
    
    getTagList: async (req, res, next) => {
        try {
      
            const tags = await Tag.find({});
            return res.send({ status: 200, data: tags, message:'Tags get successfully' });
    
        } catch (error) {
    
            
            return res.send({ status: 400, message: error.message });
        }
    },

    getAllTagList: async (req, res, next) => {
        try {
      


               let _id = req.body._id;
               const reqBody = req.body;
            
           
           
                       const Limit = reqBody.limit ? parseInt(reqBody.limit) : 10; 
                       const PageNo = reqBody.page ? parseInt(reqBody.page) : 0;
           
           
                       const tags = await Tag.find().sort({ updated_at: -1 }).skip(Limit * PageNo).limit(Limit).lean().exec();
                       const count = await Tag.count();
            
                      return res.send({ status: true, data: tags, count: count, message: 'Tags List get successfully'  ,   });

    
        } catch (error) {
    
            
            return res.send({ status: false, message: error.message });
        }
    },



    
    deleteTag: async (req, res, next) => {
    try {
        const { _id} = req.body;

     
        if (!_id) {
            return res.send({ status: false, message: '_id is required' });
        }


        const deleted = await Tag.findOneAndRemove({ _id : req.body._id}).lean().exec();

        if (!deleted) {
            return res.send({ status: false, message: 'Tag not found' });
        }

        return res.send({ status: true, message: 'Tag deleted successfully' });

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
       return res.send({ status: false, message: 'tag_id is required' });
   }
   if (!user_id) {
    return res.send({ status: false, message: 'user_id is required' });
}
if (!tag_price) {
    return res.send({ status: false, message: 'tag_price is required' });
}

               const userServiceTagModel = new ServiceTag(reqBody);
               const created = await userServiceTagModel.save();
               return res.send({ status: true, message: 'User ServiceTag created successfully' });
   
           } catch (error) {
   
               console.log(error)
               return res.send({ status: false, message: error.message });
           }
       },
   

       updateServiceTag: async (req, res, next) => {
        try {
            const reqBody = req.body;
            const Id = reqBody._id;
            const tag_price = reqBody.tag_price;
            let data = { tag_price}


            if (!Id) {
                return res.send({ status: false, message: 'Id is required' });
            }


            await ServiceTag.findByIdAndUpdate(Id, data).lean().exec();

    
            return res.send({ status: true, message: 'User ServiceTag Updated successfully' });
    
        } catch (error) {
            return res.send({ status: false, message: error.message });
        }
    },

    deleteServiceTag: async (req, res, next) => {
        try {
            const { _id} = req.body;

            if (!_id) {
                return res.send({ status: false, message: '_id is required' });
            }
    
    
            const deleted = await ServiceTag.findOneAndRemove({ _id : req.body._id}).lean().exec();
    
            if (!deleted) {
                return res.send({ status: false, message: 'User ServiceTag not found' });
            }
    
            return res.send({ status: true, message: 'User ServiceTag deleted successfully' });
    
        } catch (error) {
            return res.send({ status: false, message: error.message });
        }
    },

    getUserServiceTag: async (req, res, next) => {
        try {

            if (!req.body.user_id) {
                return res.send({ status: false, message: 'user_id is required' });
            }
      
            const userServiceTags = await ServiceTag.find({user_id : req.body.user_id});
            console.log(userServiceTags)
            return res.send({ status: true, data: userServiceTags, message:'User ServiceTag get successfully' });
    
        } catch (error) {
    
            
            return res.send({ status: false, message: error.message });
        }
    },

    
    
}

