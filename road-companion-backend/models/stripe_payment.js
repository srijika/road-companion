const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({ 
    trip_id: { type: Schema.ObjectId, ref: 'user_trips' },
    ride_id: { type: Schema.ObjectId, ref: 'riders' },
    payment_intent_id: { type: String },
    amount: { type: Number },
    client_secret: { type: String },
    currency: { type: String },
    payment_status: { type: String, default: "PENDING" }, // PENDING , SUCCESS , FAILED
},{
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('stripe_payments', schema);
