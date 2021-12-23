const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schema = new Schema({
    user_id: { type: Schema.ObjectId, required: true, ref: "users" },
    name: { type: String, default: null, trim: true },
    gender: { type: String, default: null },
    dob: { type: Date, default: new Date() },
    image: { type: String, default: null, trim: true },
    add1: { type: String, },
    add2: { type: String, },
    pincode: { type: String, },
    city: { type: String, },
    state: { type: String, },
}, {
    timestamps: { createdAt: "create", updatedAt: "updated" }
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('profile', schema);
