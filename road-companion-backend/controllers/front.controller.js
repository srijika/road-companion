const db = require('../_helper/db');
const Blog = db.Blog
const BlogsCategory = db.BlogsCategory
const NewsArticle = db.NewsArticle
const NewsCategory = db.NewsCategory




module.exports = {

    getBlogs: async (req, res, next) => {
        
        try {
            const blogs = await Blog.find({ status: "true" });
            const blogCategories = await BlogsCategory.find({});

            return res.json({ status: true, blogs: blogs, blogCategories: blogCategories });

        }catch(e) {
            console.log(e);
            return res.send({ status: false, err: "An Error Occured" })
        }
    },

    
    getBlogDetail: async (req, res, next) => {
        
        console.log(req.body);
        try {
            let id = req.body.id;
            const blog = await Blog.findById(id).populate("category_id", "category_name")
            return res.json({ status: true, blog: blog });
        }catch(e) {
            console.log(e);
            return res.send({ status: false, err: "An Error Occured" })
        }
    },

    getBlogsAndNews: async (req, res, next) => {
        
        try {
            const blogs = await Blog.find({ status: "true" });
            const blogCategories = await BlogsCategory.find({});
            const newsArticles = await NewsArticle.find({});

            
            return res.json({ status: true, blogs: blogs.reverse(), blogCategories: blogCategories, newsArticles: newsArticles.reverse() });

        }catch(e) {
            console.log(e);
            return res.send({ status: false, err: "An Error Occured" })
        }
    },
    getNews: async (req, res, next) => {
        
        try {
            const blogs = await NewsArticle.find({ status: 0 });
            const blogCategories = await NewsCategory.find({});

            return res.json({ status: true, blogs: blogs, blogCategories: blogCategories });

        }catch(e) {
            console.log(e);
            return res.send({ status: false, err: "An Error Occured" })
        }
    },

    
    getNewsDetail: async (req, res, next) => {
        
        console.log(req.body);
        try {
            let id = req.body.id;
            const blog = await NewsArticle.findById(id).populate("category_id", "category_name");
            // const cate = await NewsCategory.findOne({_id : category_id});
            // console.log(cate)
            return res.json({ status: true, blog: blog });
        }catch(e) {
            console.log(e);
            return res.send({ status: false, err: "An Error Occured" })
        }
    },

}
