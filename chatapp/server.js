const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const MongoClient = require('mongodb').MongoClient;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())
app.use(express.static('public'))

var db;
MongoClient.connect('mongodb://public:public50@ds121295.mlab.com:21295/chatapp', {
    useNewUrlParser: true
  },
  (err, client) => {
    if (err) return console.log(err)
    db = client.db('chatapp')
    app.listen(process.env.PORT || 3000, function() {
      console.log('Listening on 3000')
    })
  }
)


app.get('/', function(req, res) {
  db.collection('quotes').find().toArray((err, result) => {
    if (err) return console.log(err)
    var time = new Date();
    var now = ( /*time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds() + '   ' + */ time.getDate() + "/" + time.getMonth() + "/" + time.getFullYear());
    res.render('index.ejs', {
      quotes: result,
      now
    })
    console.log(result)
  })
})

app.post('/quotes', (req, res) => {
  db.collection('quotes').insertOne(req.body, (err, result) => {
    if (err) return console.log(err)

    console.log('saved to database')
    res.redirect('/')
  })
  //console.log(req.body)
})



console.log("Yalla, you're up and running");
