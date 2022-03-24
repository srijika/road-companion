const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const schema = new Schema({
    
    user_id:{type: Schema.ObjectId, ref: 'users'},
    requested_amount :{type:String},
    status: {
        type: String,
        enum : ['pending','completed'],
        default: 'pending'
    },
},{
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

schema.set('toJSON', { virtuals: true });
module.exports = mongoose.model('withdraw_request', schema);