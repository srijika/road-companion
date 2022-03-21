const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schema = new Schema({
    user_id: { type: Schema.ObjectId, ref: 'users'  },
    reference_id: { type: Schema.ObjectId  },
    for_notification: { type: String, default: "USER" }, // Notification type ADMIN OR USER
    title: { type: String },
    type: { type: String },
    message: { type: String, required: true },
    status: { type: Number, default: 0 }, // 0 for unread 1 for read
}, {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('notification', schema);
