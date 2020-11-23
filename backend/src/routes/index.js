const authRouter = require('./api/auth.api');
// const siteRouter = require('./api/site.api');
// const usersRouter = require('./api/user.api');

function route(app) {

    // app.use('/api/v1/user', usersRouter);
    app.use('/api/v1/auth', authRouter);
    // app.use('/api/v1', siteRouter);
    app.get('/', (req, res) => {
        res.json({success: true})
    })

}

module.exports = route;