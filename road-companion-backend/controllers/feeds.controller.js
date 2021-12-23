const { UserLogins, Feed, FeedLike, FeedComment } = require("../_helper/db");
const sharp = require("sharp");
var path = require("path");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

module.exports = {
  list: async (req, res, next) => {
    console.log(req.body);
    try {
      const { user_id } = req.body;

      let user  = await UserLogins.findById(user_id);
      let feeds = await Feed.aggregate([
        { $match: { user_id: mongoose.Types.ObjectId(user_id) } },
        {
          $lookup:{
            from: "feed_likes",           // name of mongoDB collection, NOT mongoose model
            localField: "_id",  // referenced users _id in the tests collection
            foreignField: "feed_id",     // _id from users
            as: "feed_likes",                // output array in returned object
          }
        },
        {
          $lookup:{
            from: "feed_comments",           
            localField: "_id", 
            foreignField: "feed_id",
            as: "feed_comments"     
          }, 
        }, 
        
        { $addFields: { totalFeedLikesCount: {  $size: "$feed_likes" } } },
        { $addFields: { totalFeedCommentsCount: { $size: "$feed_comments" } } }, 
      ]).exec();



      feeds.map((item) => {
        delete item.feed_likes;
        delete item.feed_comments;
        return item;
      })


      // return res.json({ status: 200, feeds: feeds });
      return res.json({ status: 200, user: user, feeds: feeds });

    } catch (e) {
      console.log(e);
      return res.json({ status: 422, message: e });
    }
  },





  viewFeed: async (req, res, next) => {  

    const { feed_id } = req.body;

    
    let feeds = await Feed.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(feed_id) } },
      {
        $lookup:{
          from: "feed_likes",           
          localField: "_id",  
          foreignField: "feed_id",
          as: "feed_likes",       
        }
      },
      {
        $lookup:{
          from: "feed_comments",           
          localField: "_id", 
          foreignField: "feed_id",
          as: "feed_comments"     
        }, 
      }, 
      
      { $addFields: { totalFeedLikesCount: {  $size: "$feed_likes" } } },
      { $addFields: { totalFeedCommentsCount: { $size: "$feed_comments" } } }, 
      { $limit: 1 }
    ]).exec();
    let feed = feeds[0];

    return res.json({ status: 200, feed: feed });
  },




  create: async (req, res, next) => {
    try {
     
      let {user_id, title} = req.body;

      if(['', null, undefined].includes(user_id)) {
        return res.send({ status: 200, message: "User id field is required"});
      }

      if(['', null, undefined].includes(title)) {
        return res.send({ status: 200, message: "Title field is required"});
      }

      // let files = req.files;
      // files && files.forEach((E) => {
      //   var filePath = path.join(__dirname, "../public/feeds/");
      //   const fileUrl = filePath + E.filename; 

      //   sharp(E.path)
      //     .resize(300, 200)
      //     .toFile(fileUrl, function (err) {
      //       if (err) {
      //       }
      //     });

      //   const str = E.originalname;
      //   const extension = str.substr(str.lastIndexOf(".") + 1);

      //   const fJson = {
      //     file: E.filename,
      //     title: E.originalname,
      //     file_type: extension,
      //     file_size: E.size,
      //   };
      //   req.body["media"] = fJson;
      // });

    

      // var file_locations = req.files.map(function(item) { return item["location"]; });
      const file_data = []; 
      req.files.map((item) => {
        let data = {
          originalname: item.originalname, 
          size: item.size, 
          mimetype: item.mimetype, 
          key: item.key, 
          location: item.location
        } 

        file_data.push(data);
      })

      req.body["media"] = file_data;

      await Feed(req.body).save();

      return res.send({ status: 200, message: "Feed post has been successfully added."});

    } catch (e) {
      return res.send({ status: 401, message: e });
    }
  },


  delete: async (req, res, next) => {
    try {
      let feed_id = req.params.feed_id;

      let feed = await Feed.findByIdAndDelete(feed_id);
      // feed.media.map((item) => {
      //   console.log(item.file);
      // })

      // return ;

      return res.send({ status: 200, message: 'Feed post has been successfully deleted.'});
    }catch(e) {
      return res.send({ status: 401, message: e, });
    }
  }, 



  feedLikes: async (req, res, next) => {

    let {user_id, feed_id} = req.body;

    try {

      
      let feeds = await FeedLike.findOne({ feed_id, user_id });
      if(feeds) {
        await FeedLike.findOneAndDelete({feed_id:feed_id, user_id:user_id});
        return res.send({ status: 200, message: 'Like has been successfully updated.'});
      }
      
      await FeedLike(req.body).save();
      return res.send({ status: 200, message: 'Like has been successfully added.'});
    
    }catch(e) {
      return res.send({ status: 401, message: e});
    }

  }, 








  feedComment: async (req, res, next) => {

    try {
      // const {user_id, feed_id, comment} = req.body;

      await FeedComment(req.body).save();
      return res.send({ status: 200, message: 'Comment has been successfully added.'});

    }catch(e) {
      return res.send({ status: 401, message: e});
    }
  }, 



  commentDelete: async (req, res, next) => {
    try {
      let comment_id = req.params.comment_id;
      
      await FeedComment.findByIdAndDelete(comment_id);
      return res.send({ status: 200, message: 'Comment has been successfully deleted.'});

    }catch(e) {
      return res.send({ status: 401, message: e});
    }
  }, 





  commentLikes: async (req, res, next) => {
    try {
      let {comment_id, user_id} = req.body;

      let comments = await FeedComment.findOne({ _id: comment_id });
      
      let data = comments.comment_likes.find(item => item === user_id);


      if(data) {

        await FeedComment.updateOne({_id: comment_id}, { $pullAll: {comment_likes: [data] } } );

        
        return res.send({ status: 200, message: 'Comment Like has been successfully updated.'});

      }else {

        // IF USER COMMENT IS NOT LIKE THAN ADD A LIKE
        comments.comment_likes.push(user_id);
        await FeedComment.updateOne({_id: comment_id}, comments );

        return res.send({ status: 200, message: 'Comment Like has been successfully added.'});
      }

    
    }catch(e) {
      return res.send({ status: 401, message: e});
    }
  }, 





};