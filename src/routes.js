const express = require('express');

const router = express.Router();

router.get('/ma/', (req, res) => {
    res.render('index');
});

module.exports = router;