const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('auth route');
});

router.get('/home', (req, res) => {
  res.send('home page of auth');
});

module.exports = router;
