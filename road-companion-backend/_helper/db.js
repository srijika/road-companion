
const mongoose = require('mongoose');


const localDB = "mongodb://127.0.0.1:27017/road-companion";

mongoose.connect(process.env.MONGODB_URI || localDB,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false }
).then(() => {
    console.log(`DB connection successfull`);
}).catch((error) => {
    console.log(error);
});
 

mongoose.Promise = global.Promise;

module.exports = {
    Blog: require('../models/blogs'),
    BolgCategory: require('../models/blogs-categories'),
    Contact: require('../models/contact'),
    Faq: require('../models/faq'),
    Banner: require('../models/banners'),
    Notification: require('../models/notifications'),
    Profile: require('../models/profile'),
    Setting: require('../models/settings'),
    UserLogins: require('../models/users'),
    Otp: require('../models/otp'),
    Feed: require('../models/feeds'),
    FeedLike: require('../models/feed.likes'),
    FeedComment: require('../models/feed.comments'),

    Review: require('../models/shop_review'),
    Shop: require('../models/shop'),
    Tag: require('../models/tag'),
    ServiceTag: require('../models/user_servicing_tags'),
    PostReport: require('../models/post-report'),
    PostReport: require('../models/post-report'),
    Appointment: require('../models/appointment'),
    FriendRequest: require('../models/friend-request'),
    HtmlPages: require('../models/htmlPages'),
    Frequently_Asked_Question: require('../models/frequently_asked_question'),






};
