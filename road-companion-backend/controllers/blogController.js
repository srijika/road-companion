const { page } = require('pdfkit');
const { Blog } = require('../_helper/db');
var path = require('path');
var fs = require('fs');
const sharp = require('sharp');

module.exports = {
    createBlogs: async (req, res, next) => {

        try {

            // console.log(req.body);
            // return ;
            let findCategory = await Blog.find({title : req.body.title})
            if(findCategory.length > 0){
                res.send({ status: false, message: "Title Already Exits"});
                return false;
            }
            const reqBody = req.body;
            reqBody.loginid = req.user._id;

            console.log(reqBody.isActive === '')


            let title = req.body.title;
            title = title.toLowerCase();


            // IMAGE UPLOAD CODE
            const reqFiles = req.files;
            let filename;
            if(reqFiles.length > 0) {

                reqFiles.forEach(E => {
                    var filePath = path.join(__dirname, '../public/blogs/');
                    if (!fs.existsSync(filePath)) {
                    fs.mkdirSync(filePath);
                }
                
                const fileUrl = filePath + E.filename;
                sharp(E.path).resize(300, 200).toFile(fileUrl, function (err) {
                    if (err) {
                        console.log(err)
                    }
                });
                
                filename = E.filename;
                });
            }
            // IMAGE UPLOAD CODE END



            let slug = title.replace(" ", "-");
            let data = {
                title : title ,
                category_id : reqBody.category_id,
                meta_title : reqBody.meta_title ,
                meta_description : reqBody.meta_description ,
                html : reqBody.html ,
                slug : slug ,
                status : reqBody.isActive === '' ? false : true ,
                image : filename ,

            }

            const blogModel = new Blog(data);
            const created = await blogModel.save();
            return res.send({ status: true, data: created._id, message: 'Blog created successfully' });

        } catch (error) {

            console.log(error)
            return res.send({ status: false, message: error.message });
        }
    },

    updateBlogs: async (req, res, next) => {
        try {
            const reqBody = req.body;
            const Id = reqBody._id;

            let findTitle = await Blog.find( {_id: {$ne: Id} ,title: req.body.title });


            console.log(findTitle.length)
            if(findTitle.length > 0){
                res.send({ status: false, message: "Title Already Exits"});
                return false;
            
            }
            
            


            if (!Id) {
                return res.send({ status: false, message: 'Id is required' });
            }


            // IMAGE UPLOAD FOR EDIT START
            const reqFiles = req.files;
            let filename;
            console.log(reqFiles.length);
            if(reqFiles.length > 0) {

                var filePath = path.join(__dirname, '../public/blogs/');
                
                if (!fs.existsSync(filePath)) {
                    fs.mkdirSync(filePath);
                }

                // FOR IMAGE DELETE START
                let category_image = await Blog.findById(req.body._id);
                let delete_image =  path.join(__dirname, `../public/blogs/${category_image.image}`);
                try {
                    fs.unlink(delete_image, function (err) {
                        console.log("File deleted!");
                    });
                } catch (err) {
                    console.log(err);
                }
                // FOR IMAGE DELETE END
                const fileUrl = filePath + reqFiles[0].filename;
                sharp(reqFiles[0].path).resize(300, 200).toFile(fileUrl, function (err) {
                    if (err) {
                        console.log(err)
                    }
                });
                filename = reqFiles[0].filename;
            }
            // IMAGE UPLOAD FOR EDIT END

            let title = req.body.title;
            title = title.toLowerCase();
            reqBody.slug = title.replace(" ", "-");

            if(filename != undefined && filename != "" && filename != null) {
                reqBody['image'] = filename;
            }

            reqBody.status = reqBody.isActive === '' ? false : true
            await Blog.findByIdAndUpdate(Id, reqBody).lean().exec();

            return res.send({ status: true, message: 'Page updated successfully' });

        } catch (error) {
            return res.send({ status: false, message: error.message });
        }
    },

    getBlogs: async (req, res, next) => {
        try {
            const reqQuery = req.query;
            const slug = reqQuery.slug;

            if (!slug) {
                return res.send({ status: false, message: 'slug is required' });
            }

            const Page = await Blog.find({slug: slug}).lean().exec();

            if (!Page) {
                return res.send({ status: false, message: 'Page not fount for this slug' });
            }

            return res.send({ status: true, data: Page, message: slug+' get successfully' });

        } catch (error) {

            
            return res.send({ status: false, message: error.message });
        }
    },

    getAllBlogs: async (req, res, next) => {
        try {

            const reqBody = req.body;



            const Limit = reqBody.limit ? parseInt(reqBody.limit) : 10;
            const PageNo = reqBody.page ? parseInt(reqBody.page) : 0;

            const AllPages = await Blog.find().sort({ updated_at: -1 }).skip(Limit * PageNo).limit(Limit).lean().exec();
            console.log(AllPages)
            // return ;

            const count = await Blog.count();

         
            return res.send({ status: true, data: AllPages, count: count, message: 'All Page get successfully' });

        } catch (error) {
            return res.send({ status: false, message: error.message });
        }
    },

    deleteBlogs: async (req, res, next) => {
        try {
            const reqQuery = req.query;
            const slug = reqQuery.slug;

            if (!slug) {
                return res.send({ status: false, message: 'slug is required' });
            }

            const deleted = await Blog.findOneAndRemove({slug: slug}).lean().exec();

            if (!deleted) {
                return res.send({ status: false, message: 'Page not found' });
            }

            return res.send({ status: true, message: 'Page deleted successfully' });

        } catch (error) {
            return res.send({ status: false, message: error.message });
        }
    },

    statusUpdate: async (req, res, next) => {
        try {
            const reqBody = req.body;
            const Id = reqBody._id;
            const isActive = reqBody.isActive ? true : false;

            if (!Id) {
                return res.send({ status: false, message: 'Id is required' });
            }

            await Blog.findByIdAndUpdate(Id, { isActive: isActive }).lean().exec();

            return res.send({ status: true, message: 'Status updated successfully' });

        } catch (error) {
            return res.send({ status: false, message: error.message });
        }
    }

}
