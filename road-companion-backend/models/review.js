const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({ 
    driver_id: { type: Schema.ObjectId, ref: 'users' },
    reviewer_id: { type: Schema.ObjectId, ref: 'users' },
    title: { type: String, },
    description: { type: String, },
    rating: {type: Number}, 
},{
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('reviews', schema);
