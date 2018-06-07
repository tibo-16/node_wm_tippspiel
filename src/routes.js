const express = require('express');

const router = express.Router();

router.get('/ma/', (req, res) => {
    res.render('index');
});

router.post('/ma/tobi', (req, res) => {
    res.send('Hallo Tobi!');
});

module.exports = router;