const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({ 
    trip_id: { type: Schema.ObjectId, ref: 'user_trips' },
    driver_id: { type: Schema.ObjectId, ref: 'users' },
    user_id: { type: Schema.ObjectId, ref: 'users' },
    total_seats: { type: Number, },
    carrying_dim_height: { type: Number },
    carrying_dim_width: { type: Number },
    carrying_capacity_weight: { type: Number },
    amount: { type: Number },
    trip_type: { type: String }, // LUGGAGE or BOOK_SEAT
    payment_method: { type: String }, // STRIPE , WALLET
    status: { type: String, default: "PAYMENT_PENDING" }, // PAYMENT_PENDING, PAYMENT_FAILED, INTRESTED , CANCELLED , CONFIRMED , PICKUP, FINISHED 
},{
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('riders', schema);
