const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    user_id: { type: Schema.ObjectId, required: true, ref: "users" },
    title: { type: String },    
    media: { type: Array },
    posted_location: { type: String },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);


schema.set("toJSON", { virtuals: true });
module.exports = mongoose.model("feeds", schema);
