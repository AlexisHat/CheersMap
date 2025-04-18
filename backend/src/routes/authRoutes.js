const express = require('express');
const router = express.Router();

const controller = require('../controllers/authController')

router.get('/login' , controller.login);

router.post('/register', (req, res) => {
    res.send('sex');
});


module.exports = router;