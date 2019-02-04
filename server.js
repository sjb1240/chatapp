const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const MongoClient = require('mongodb').MongoClient;

const portNumber = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())
app.use(express.static('public'))

var db;

function time() {
  var d = new Date();
  var s = d.getSeconds();
  var m = d.getMinutes();
  var h = d.getHours();
  var h = ("0" + h).slice(-2);
  var month = d.getMonth() + 1;
  var day = d.getDate();
  m = checkTime(m);
  s = checkTime(s);
  return h + ":" + m + " | " + day + "/" + month;
}
setInterval(time, 1000);

function checkTime(i) {
  if (i < 10) {
    i = "0" + i
  }; // add zero in front of numbers < 10
  return i;
}


MongoClient.connect('mongodb://public:public50@ds121295.mlab.com:21295/chatapp', {
    useNewUrlParser: true
  },
  (err, client) => {
    if (err) return console.log(err)
    db = client.db('chatapp')
    app.listen(portNumber)
  }
)


app.get('/', function(req, res) {
  db.collection('quotes').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('index.ejs', {
      quotes: result
    })
    console.log(result)
  })
})

app.post('/quotes', (req, res) => {
  var reqreq = req.body
  reqreq.time = time()
  db.collection('quotes').insertOne(reqreq, (err, result) => {
    if (err) return console.log(err)

    console.log('saved to database')

    res.redirect('/')
  })
  //console.log(req.body)
})

app.post('delete', (req, res) => {
      db.collection("quotes").deleteMany({}, function(err, obj) {
        if (err) throw err;
        console.log(obj.result.n + " document(s) deleted");
        db.close();
      });
    });

    console.log("Yalla, you're up and running");
