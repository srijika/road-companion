const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schema = new Schema({
    post_id: { type: Schema.ObjectId   },
    user_id: { type: Schema.ObjectId ,  ref : "users" },
    report_reason: { type: String,  },
}, {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('post_reports', schema);
