const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema(
    {
        title: {
            type: 'String', 
            required: true ,
            // unique : true,
        }, 
        category_id: {
            type: Schema.Types.ObjectId,
            ref: "blogscategories",
        },
        meta_title: {
            type: 'String', 
           
        }, 
        meta_description: { 
            type: 'String',  
            
        }, 
        html: {
            type: 'String', 
            required: true
        }, 
        slug: { 
            type: 'String', 
            required: true
        }, 
    
        image: {
            type: 'String',   
            required: true
        },
    
        status: {
            type: 'String', 
            required: true
        },
    
        created_at: {
            type: Date, default: new Date
        }
    
    }
    );

schema.set('toJSON', { virtuals: true });
module.exports = mongoose.model('blogs', schema);