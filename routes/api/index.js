const router = require('express').Router();
const thoughtRoutes = require('./thoughtRoutes');
const userRoutes = require('./userRoutes');

// api routes for thoughts and users
router.use('/thoughts', thoughtRoutes);
router.use('/users', userRoutes);

module.exports = router;