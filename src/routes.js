const express = require('express');

const router = express.Router();

router.get('/ma/', (req, res) => {
    res.render('index');
});

router.post('/ma/fabi', (req, res) => {
    res.send('Hallo Fabi!');
});

router.post('/ma/maddin', (req, res) => {
    res.send('Hallo Maddin!');
});

router.post('/ma/rudi', (req, res) => {
    res.send('Hallo Rudi!');
});

router.post('/ma/tobi', (req, res) => {
    res.send('Hallo Tobi!');
});

module.exports = router;