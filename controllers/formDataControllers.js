var db = require('../config/database');
const fs = require('fs');
const fastcsv = require("fast-csv");
const CsvParser = require("json2csv").Parser;

require('dotenv').config({ path: __dirname + '/.env' })
var base_url = process.env['BASE_URL']

/*
exports.getPage = function(req, res, next) {
    var feed_id = req.body.feed_id;
    res.render('data',{feed: feed_id});

}
*/

const getFeedDetails = (feed_pubkey) => db.query('SELECT * FROM feeds WHERE public_key = $1', [feed_pubkey]).then(response => response.rows[0])
.catch((err) => {
    console.log("couldn't find feed_id for that key!");
  });



exports.getPage = function(req, res, next) {
    var feed_id = req.body.feed_id;
    var target_url = '/co2/data/'.concat(feed_id.toString());
    res.redirect(target_url);
}



exports.postTestMeasurement = function(req, res, next) {  // NOW BY PUB KEY

    console.log("got here!");
    // for use with the 'create_feed.pug' page
    // we need to add the additional parameters that Bayou expects
    console.log("received:");
    console.log(req.body.feed_pubkey,req.body.feed_privkey,req.body.co2);

    var feed_pubkey = String(req.body.feed_pubkey);
    var private_key = String(req.body.feed_privkey);
    var co2 = parseInt(req.body.co2);
    var tempC = 30.;
    var humidity = 30.;
    var mic = 30.;
    var auxPressure = 2000.;
    var auxTempC = 30.;
    var aux001 = 100.;
    var aux002 = 100.;
    
    getFeedDetails(String(req.body.feed_pubkey))
    .then((feed_params) => {
        var feed_id = feed_params.feed_id;

    console.log(private_key,co2,tempC,humidity,mic,auxPressure,auxTempC,aux001,aux002);

    console.log(private_key);

      const query = {
        text: 'SELECT * FROM feeds WHERE feed_id = $1',
        values: [feed_id],
      }

    console.log('poster key is:');
    console.log(private_key);

   db.query(query, (error, results) => {
    if (error)
        throw error;
        
    console.log("associated private_key is:");
    var key_to_match =results.rows[0].private_key;
    console.log(key_to_match);
    if(private_key==key_to_match) {
        console.log("key match!");

  // Check if values are int, float and float

  var dataValid = (
    typeof co2 == 'number' &&
    typeof tempC == 'number' &&
    typeof humidity == 'number' &&
    typeof mic == 'number' &&
    typeof auxPressure == 'number' &&
    typeof auxTempC == 'number' &&
    typeof aux001 == 'number' &&
    typeof aux002 == 'number'
)

console.log("dataValid=",dataValid)

if (dataValid)  {
    // Create new measurement
    var insertSQL = `INSERT INTO measurements (feed_id, co2, tempC, humidity, mic, auxpressure, auxTempC, aux001, aux002) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);`
    var params = [feed_id, co2, humidity, tempC, mic, auxPressure, auxTempC, aux001, aux002]

    db.query(insertSQL, params, (error, result) => {
        if (error) {
            res.status(400).send(error);
        } else {
            console.log(co2);
            res.status(200).render('test_measurement_recorded',{feed_pubkey:feed_pubkey,base_url:base_url,co2_value:co2});
            //res.status(200).send('Measurement recorded\n');    
        }
    });

} else {
    res.status(400).send('Please check that your data types are correct' );
}

    }
    else{
        console.log("keys don't match!");
        res.status(400).send('Private key mismatch.\n' );

    }
});
    })
    .catch((err) => {
        console.log("couldn't get measurements for that feed_id!");
        console.log(err);
       });
}


exports.getCSV = function(req, res, next) {

    var feed_id = req.body.feed_id;

    var ws = fs.createWriteStream('measurements.csv');
    const tableName = 'measurements';

    const query = `SELECT * FROM ${tableName} WHERE feed_id = ${feed_id}`;

    // pass SQL string and table name to query()
db.query(query, (err, response) => {

    if (err) {
    console.log("client.query()", err.stack)
    }
    
    if (response) {
    
    const jsonData = JSON.parse(JSON.stringify(response.rows));
    console.log("\njsonData:", jsonData)
    
    const csvFields = ["id", "feed_id", "created","celcius"];

    const csvParser = new CsvParser({ csvFields });
    const csvData = csvParser.parse(jsonData);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=measurements.csv");

    //res.status(200).end(csvData);
    return res.status(200).send(csvData);
    }
});
}

exports.getJSON = function(req, res, next) {

    var feed_id = req.body.feed_id;

    const query = `SELECT * FROM measurements WHERE feed_id = ${feed_id}  ORDER BY created DESC`;

    db.query(query, (error, results) => {
        if (error)
            throw error;
        res.status(200).json(results.rows);
    });
}

