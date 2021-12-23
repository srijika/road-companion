const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schema = new Schema({

    sender_id: { type: Schema.ObjectId, required: true },
    reciever_id: { type: Schema.ObjectId, required: true },
    accept_status: { type: Boolean, default: false },
    send_date: { type: Date,  default: new Date() },
    accepted_date: { type: Date },
 
   
}, {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('friend_requests', schema);
