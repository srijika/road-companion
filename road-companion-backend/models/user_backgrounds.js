const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    background : { type: String },
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('user_backgrounds', schema);
