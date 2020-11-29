const authRouter = require('./api/auth.api');
const userRouter = require('./api/user.api');
// const siteRouter = require('./api/site.api');

function route(app) {

    app.use('/api/v1/user', userRouter);
    app.use('/api/v1/auth', authRouter);
    // app.use('/api/v1', siteRouter);
}

module.exports = route;