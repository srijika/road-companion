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
    
    user_id: { type: Schema.ObjectId, ref: 'users' },
    from_destination: { type: String},
    to_destination: { type: String},
    from_location : {
        type: geoSchema,
        index: '2dsphere'
    },
    to_location : {
        type: geoSchema,
        index: '2dsphere',
    },
    date_of_departure: { type: String},
    date_of_arrival: { type: String},
    time_of_departure: { type: String},
    time_of_arrival: { type: String},
    travel_price: { type: String},
    luggage_price: { type: String},
    available_seats: { type: String},
    luggage_weight: { type: String},
    description: { type: String},
    ssn_number: { type: String},
    is_smoking: { type: String, enum : ['YES','NO'] },
    is_recurring: { type: String, enum : ['YES','NO']},
    recurring_travel_days: { type: String},
    driving_license_image : { type: String}
    
}, {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('user_trips', schema);
