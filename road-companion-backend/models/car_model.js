const mongoose = require('mongoose');
const Schema = mongoose.Schema;

 
 

const schema = new Schema({
    
    car_id:{type: Schema.ObjectId, ref:"car"},
    car_model :{type:String},
    isActive: { type: Boolean, default: true },
},{
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

schema.set('toJSON', { virtuals: true });
module.exports = mongoose.model('car_model', schema);
