var express = require('express');
var router = express.Router();
var passport = require('passport')
var basicAuth = passport.authenticate('basic', { session: false })
var data_feeds = require('../controllers/dataControllers');
var path = require("path");
const cors = require('cors');


const whitelist = ['http://data.pvos.org','http://192.168.1.163:3000']
const corsOptions = {
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
  }
  

router.get('/:feed_pubkey/',data_feeds.getPage);

router.get('/:feed_pubkey/json/', data_feeds.getJSON);

router.get('/:feed_pubkey/csv/',data_feeds.getCSV);

router.post('/:feed_pubkey/', data_feeds.postNewMeasurement);

router.get('/:feed_pubkey/latest/',data_feeds.getLatestMeasurement);

module.exports = router;