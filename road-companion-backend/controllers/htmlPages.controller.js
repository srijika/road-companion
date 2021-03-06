
const { HtmlPages } = require('../_helper/db');
const { UserLogins } = require('../_helper/db');

// const UserLogins = db.UserLogins;


module.exports = {
    createHtmlPages: async (req, res, next) => {
        try {
            const reqBody = req.body;
            reqBody.loginid = req.user._id;
            let title = req.body.title;
            let findTitle = await HtmlPages.find({ title: title });

            if (findTitle.length > 0) {
                res.send({ status: false, message: "Title Already Exits" });
                return false;

            }

            title = title.toLowerCase();
           // let slug = title.replace(" ", "_");
            let slug = title.replace(/[^\w ]+/g, '').replace(/ +/g, '-');

            let data = {
                title: reqBody.title,
                slug: slug,
                html: reqBody.html,
                loginid: reqBody.loginid,
                isActive: reqBody.isActive === '' ? false : true,

            }
            const pageModel = new HtmlPages(data);

            const created = await pageModel.save();
            return res.send({ status: true, data: created._id, message: 'Page created successfully' });

        } catch (error) {
            return res.send({ status: false, message: error.message });
        }
    },

    tAndC: async (req, res, next ) => {

    const Page = await HtmlPages.find({ slug: 'terms-and-conditions' }).lean().exec();

    res.render('term-and-condition', {
        page: Page[0].html,
        title: Page[0].title
    });
    

    },
    privacyPolicy: async (req, res, next ) => {

        const Page = await HtmlPages.find({ slug: 'privacy-policy' }).lean().exec();
        
        res.render('term-and-condition', {
            page: Page[0].html,
            title: Page[0].title
        });
    
    },

    updateHtmlPages: async (req, res, next) => {
        try {
            const reqBody = req.body;
            const Id = reqBody._id;
            let title = req.body.title;
          

            reqBody.isActive = reqBody.isActive === '' ? false : true



            if (!Id) {
                return res.send({ status: false, message: 'Id is required' });
            }

            let findTitle = await HtmlPages.find({ _id: { $ne: Id }, title: title });
            if (findTitle.length > 0) {
                res.send({ status: false, message: "Title Already Exits" });
                return false;

            }

            title = title.toLowerCase();
            reqBody.slug = title.replace(/[^\w ]+/g, '').replace(/ +/g, '-');
            await HtmlPages.findByIdAndUpdate(Id, reqBody).lean().exec();

            return res.send({ status: true, message: 'Page updated successfully' });

        } catch (error) {
            return res.send({ status: false, message: error.message });
        }
    },

    getHtmlPages: async (req, res, next) => {
        try {
            const reqQuery = req.query;
            const slug = reqQuery.slug;

            if (!slug) {
                return res.send({ status: false, message: 'slug is required' });
            }

            const Page = await HtmlPages.find({ slug: slug }).lean().exec();

            if (!Page) {
                return res.send({ status: false, message: 'Page not fount for this slug' });
            }

            return res.send({ status: true, data: Page, message: slug + ' get successfully' });

        } catch (error) {
            return res.send({ status: false, message: error.message });
        }
    },

    getAllHtmlPages: async (req, res, next) => {
        try {
            const reqBody = req.body;
            const Limit = reqBody.limit ? parseInt(reqBody.limit) : 10;
            const PageNo = reqBody.page ? parseInt(reqBody.page) : 0;
            const sortColumn = reqBody.sortColumn ? reqBody.sortColumn : "updated";
            const sortType = reqBody.sortType ? reqBody.sortType == "asc" ? 1 : -1 : -1;
 
            const data = await HtmlPages.find().sort({ _id: -1 }).skip(Limit * PageNo).limit(Limit).lean().exec();
            const count = await HtmlPages.count();
            
            console.log('count', count)

            return res.send({ status: true, data: data, total: count, message: 'All Page get successfully', });

        } catch (error) {
            return res.send({ status: false, message: error.message });
        }
    },

    deleteHtmlPages: async (req, res, next) => {
        try {
            const reqQuery = req.query;
            const slug = reqQuery.slug;

            if (!slug) {
                return res.send({ status: false, message: 'slug is required' });
            }

            const deleted = await HtmlPages.findOneAndRemove({ slug: slug }).lean().exec();

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

            await HtmlPages.findByIdAndUpdate(Id, { isActive: isActive }).lean().exec();

            return res.send({ status: true, message: 'Status updated successfully' });

        } catch (error) {
            return res.send({ status: false, message: error.message });
        }
    },



}
