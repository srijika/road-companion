const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schema = new Schema({
    name : { type: String },
    email: { type: String, unique: true },
    mobile_number: { type: String },
    password: { type: String },
    roles: { type: String }, // 'CUSTOMER'  'USER'  'ADMIN'
    type_login: { type: String },
    otp: { type: String, default: null },
    isEmailVerified: { type: Boolean, default: false },
    isMobileVerified: { type: Boolean, default: false },
    user_status: { type: Boolean, default: false },
    avatar: { type: String, default: null },
    user_background: { type: String },
    no_of_loggedin: { type: Number, default: 0 },
    last_login_time: { type: Date, default: null }, // for login history
    firebase_fcm_token: { type: String, default: null }, // for login history
    stripe_customer_id: { type: String },
    stripe_account: { type: String },
    wallet_amount: { type: Number, default: 0 },
    

    // ip_address: { type: String, default: null },
    // mobile_otp: { type: String, default: null },
    // socialid: { type: String , },
    // deactive: { type: Boolean, default: false },  
    // maintenance_mode_for_user: { type: Boolean, default: false },  
    // note: { type: String }

});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('users', schema);
