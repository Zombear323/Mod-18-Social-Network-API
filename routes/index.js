const router = require('express').Router();
const apiRoutes = require('./api');

// api routes
router.use('/api', apiRoutes);

// send error if wrong routes
router.use((req, res) => {
    return res.send('Wrong route!');
});

module.exports = router;