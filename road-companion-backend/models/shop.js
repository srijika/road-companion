const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const geoSchema = new Schema({
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: {
      type: [Number]
    }
  });  
 

const schema = new Schema({
    user_id: { type: Schema.ObjectId },
    shop_name: { type: String, },
    shop_location: { type: String, },
    is_mobile_appointment: { type: Boolean,  },
    is_location_access: { type: Boolean,  },
    lattitude: { type: Number },
    longitude: { type: Number },
    status: { type: Boolean, default: false  },
    location: {
        type: geoSchema,
        index: '2dsphere'
  },
  shop_photo: { type: String, },
 

}, {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('shops', schema);
