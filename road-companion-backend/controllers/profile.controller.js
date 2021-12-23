












module.exports = {

    create: async (req, res, next) => {
        
        try {
            const blogs = await Blog.find({ status: "true" });
            const blogCategories = await BlogsCategory.find({});

            return res.json({ status: true, blogs: blogs, blogCategories: blogCategories });

        }catch(e) {
            console.log(e);
            return res.send({ status: false, err: "An Error Occured" })
        }
    },


}
