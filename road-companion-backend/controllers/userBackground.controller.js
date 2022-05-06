const { UserBackground } = require('../_helper/db');

module.exports = {
    addBackground: async (req, res, next) => {
        try {

            let data = {};
            if (req.files && req.files[0] && req.files[0].location) {
                data['background'] = req.files[0].location;
            }            

            await (new UserBackground(data)).save();
        
            return res.status(201).send({ status: true, message: "Background image add successfully" });
        } catch (error) {
            return res.status(400).send({ status: false, message: error.message });
        }
    },

    getBackground: async (req, res, next) => {
        try {            
            let data = await UserBackground.find({});
    
            return res.status(201).send({ status: true, data: data });
        } catch (error) {
            return res.status(400).send({ status: false, message: error.message });
        }
    },


  
   
}
