//import React from 'react';
import dva from 'dva'; // { connect }
import createLoading from 'dva-loading';
import 'antd/dist/antd.less'   //'antd/dist/antd.css';
import './style.css';
import './services/css/index.css';

const app = dva();
// 2. Plugins
app.use(createLoading());

app.model(require('./models/tags').default)
app.model(require('./models/reports').default)
app.model(require('./models/shops').default)
app.model(require('./models/global').default);
app.model(require('./models/auth').default);
app.model(require('./models/product').default);
app.model(require('./models/campaign').default);
app.model(require('./models/caseLog').default);
app.model(require('./models/category').default);
app.model(require('./models/subcategory').default);
app.model(require('./models/setting').default);
app.model(require('./models/users').default);
app.model(require('./models/seller').default);
app.model(require('./models/account').default);
app.model(require('./models/order').default);
app.model(require('./models/ticket').default);
app.model(require('./models/communication').default);
app.model(require('./models/advertising').default);
app.model(require('./models/news').default);
app.model(require('./models/news-category').default);
app.model(require('./models/coupon').default);
app.model(require('./models/homepage').default);
app.model(require('./models/shipping-rate').default);
app.model(require('./models/frequently-asked-question').default);
app.model(require('./models/questions-answers').default);
app.model(require('./models/billing-and-invoice').default);
app.model(require('./models/pages').default)
app.model(require('./models/cars').default)
app.model(require('./models/car-model').default)
app.model(require('./models/colors').default)
app.model(require('./models/types').default)
app.model(require('./models/reviews').default)
app.model(require('./models/withdraw-requests').default)

app.model(require('./models/blogs').default)
app.model(require('./models/blogs-category').default)
app.model(require('./models/return-policy').default)





app.model(require('./models/notification').default)
app.model(require('./models/transaction').default)

app.router(require('./router').default);
app.start('#root');