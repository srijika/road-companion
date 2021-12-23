const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    feed_id: { type: Schema.ObjectId, required: true, ref: "feeds" },
    user_id: { type: Schema.ObjectId, required: true, ref: "users" },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);


schema.set("toJSON", { virtuals: true });
module.exports = mongoose.model("feed_likes", schema);
