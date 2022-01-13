const mongoose = require('mongoose');
const Schema = mongoose.Schema;

 
 

const schema = new Schema({
    
    car_id:{type: String},
    car_model :{type:String}
},{
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

schema.set('toJSON', { virtuals: true });
module.exports = mongoose.model('car_model', schema);
