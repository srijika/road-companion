const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schema = new Schema({
    username: { type: String,  required: true },
    email: { type: String, unique: true, required: true },
    mobile_number: { type: String ,  unique: true, required: true},
    password: { type: String, required: true },
    roles: { type: String, required: true }, // 'CUSTOMER'  'BARBER'  'ADMIN'
    type_login: { type: String },
    otp: { type: String, default: null },
    isEmailVerified: { type: Boolean, default: false },
    isMobileVerified: { type: Boolean, default: false },
    user_status: { type: Boolean, default: false },
    avatar: { type: String, default: null },
    no_of_loggedin: { type: Number, default: 0 },
    last_login_time: { type: Date, default: null }, // for login history




    // ip_address: { type: String, default: null },
    // mobile_otp: { type: String, default: null },
    // socialid: { type: String , },
    // deactive: { type: Boolean, default: false },  
    // maintenance_mode_for_user: { type: Boolean, default: false },  
    // firebase_token: { type: String, default: null }, // for login history
    // note: { type: String }

});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('users', schema);
