const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schema = new Schema({
    user_id: { type: Schema.ObjectId , default: '' },
    tag_id: { type: Schema.ObjectId },
    tag_price: { type: Number, default: '' },
}, {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('user_servicing_tags', schema);
