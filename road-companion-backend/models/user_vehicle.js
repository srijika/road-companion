const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    type_id: { type: Schema.ObjectId, ref: 'CarType' },
    make_id: { type: Schema.ObjectId, ref: 'Car' },
    user_id: { type: Schema.ObjectId, ref: 'users' },
    model_id:{ type: Schema.ObjectId, ref: 'CarModel' },
    year: { type: String, default: null },
    colour: { type: String, default: null },
    seat_available: { type: String, default: null },
    carrying_capacity: { type: String, default: null },
    carrying_dimension: { type: String, default: null },
    is_smoking: { type: String, default: null },
    insurance_no: { type: String, default: null },
    insurance_certificate: { type: String, default: null },
    images: { type: Array, default: [] },

}, {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});
schema.set('toJSON', { virtuals: true });
module.exports = mongoose.model('user_vehicle', schema);