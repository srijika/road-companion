const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    feed_id: { type: Schema.ObjectId, required: true, ref: "feeds" },
    user_id: { type: Schema.ObjectId, required: true, ref: "users" },
    comment: { type: String },    
    // comment_id: { type: String },    
    comment_likes: { type: Array, },    
    comment_reply: { type: Array, },    
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);


schema.set("toJSON", { virtuals: true });
module.exports = mongoose.model("feed_comments", schema);
