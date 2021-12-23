const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schema = new Schema({
    loginid: { type: Schema.ObjectId },
    for_notification: { type: String, default: "user" }, // NOtification for admin and seller/user admin for all admins
    message: { type: String, required: true },
    notification_type: { type: String, required: true },
    status: { type: Number, default: 0 }, // 0 for unread 1 for read
    create: { type: Date, required: true, default: new Date() },
    updated: { type: Date, required: true, default: new Date() },
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('notification', schema);
