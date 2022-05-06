//import React from 'react';
import dva from 'dva'; // { connect }
import createLoading from 'dva-loading';
import 'antd/dist/antd.less'   //'antd/dist/antd.css';
import './style.css';
import './services/css/index.css';

const app = dva();

app.use(createLoading());
app.model(require('./models/global').default);
app.model(require('./models/auth').default);
app.model(require('./models/setting').default);
app.model(require('./models/users').default);
app.model(require('./models/homepage').default);
app.model(require('./models/frequently-asked-question').default);
app.model(require('./models/pages').default)
app.model(require('./models/cars').default)
app.model(require('./models/car-model').default)
app.model(require('./models/colors').default)
app.model(require('./models/types').default)
app.model(require('./models/withdraw-request').default)
app.model(require('./models/user-trips').default)
app.model(require('./models/notification').default)
app.model(require('./models/transaction').default)
app.model(require('./models/wallet-add-cash').default)

app.router(require('./router').default);
app.start('#root');