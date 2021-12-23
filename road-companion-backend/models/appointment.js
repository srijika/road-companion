const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const schema = new Schema({
    shop_id: { type: Schema.ObjectId },
    user_id: { type: Schema.ObjectId },
    service_tags:{ type: Array },
    status: { type: String,  },
    // arrival_date_time: { type: Date,  },
    appointment_date: { type: String,  },
    totalAmt: { type: Number,  },

   
}, {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('appointments', schema);
