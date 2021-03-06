const mongoose = require('mongoose');
const Schema = mongoose.Schema;

 
 

const schema = new Schema({   
    title: { type: String},
    status: { type: Boolean, default: true },
    make: { type: Boolean },
}, {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});
schema.set('toJSON', { virtuals: true });
module.exports = mongoose.model('car_types', schema);
