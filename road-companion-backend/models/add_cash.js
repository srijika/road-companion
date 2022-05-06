const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const schema = new Schema({
    user_id:{type: Schema.ObjectId, ref: 'users'},
    amount :{type:Number},
    status: {
        type: String,
        enum : ['PENDING','FAILED','SUCCESS'],
        default: 'PENDING'
    },
    payment_intent_id: { type: String },
    client_secret: { type: String },
    currency: { type: String },
},{
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

schema.set('toJSON', { virtuals: true });
module.exports = mongoose.model('add_cash', schema);
