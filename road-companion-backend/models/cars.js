const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    type_id: { type: Schema.ObjectId, ref: 'car_types' },
    brand_name: { type: String},
    status: { type: Boolean, default: true },
}, {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('car', schema);
