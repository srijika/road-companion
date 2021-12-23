const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schema = new Schema({
    shop_id: { type: Schema.ObjectId },
    user_id: { type: Schema.ObjectId },
    review: { type: String, default: '' },
    rating: { type: Number, default: '' },
}, {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('shop_reviews', schema);
