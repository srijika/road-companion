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
    vehicle_id: { type: Schema.ObjectId, ref: 'user_vehicle' },
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
    date_of_departure: { type: Date},
    date_of_arrival: { type: Date},
    time_of_departure: { type: Date},
    time_of_arrival: { type: Date},
    
    travel_price: { type: String},
    luggage_price: { type: String},
    available_seats: { type: String},
    driver_name: { type: String},
    license_no: { type: String},
    luggage_weight: { type: String},
    
    from_city: { type: String},
    to_city: { type: String},
    from_state: { type: String},
    to_state: { type: String},

    description: { type: String},
    ssn_number: { type: String},
    is_smoking: { type: String, enum : ['YES','NO'] },
    is_recurring: { type: String, enum : ['YES','NO']},
    recurring_travel_days: { type: String},
    driving_license_image : { type: String}
    
}, {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

schema.index({ "from_location": "2dsphere", "to_location":"2dsphere"});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('user_trips', schema);
