const mongoose = require('mongoose');
const Schema = mongoose.Schema;

 
 

const schema = new Schema({
   
    brand_name: { type: String},
    
}, {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('car', schema);
