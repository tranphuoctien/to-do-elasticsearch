const elasticsearch = require('elasticsearch');
const client = new elasticsearch.Client({
  hosts: ['http://localhost:9200']
});
const indexKey = 'job-luan-van';
const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const path = require('path');
const jobcoll = require('./connection');

client.ping({
  requestTimeout: 30000,
}, function (error) {
  if (error) {
    console.error('elasticsearch cluster is down!');
  } else {
    console.log('Everything is ok');
  }
});


app.use(bodyParser.json())
app.set('port', process.env.PORT || 3001);
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', function (req, res) {
  res.sendFile('template.html', {
    root: path.join(__dirname, 'views')
  });
});

app.get('/search', function (req, res) {
  jobcoll.search({
    query_string: {
      query: req.query['q']
    }
  }, function(err, results) {
    console.log('err:', err);
    return res.send(results.hits.hits);
  });
})

app.get('/search-title', function (req, res) {
  jobcoll.search({
    match: {
      title: req.query['q']
    }
  }, function(err, results) {
    console.log('err:', err);
    return res.send(results.hits.hits);
  });
})


app.post('/job/new',function (req, res) {
  var docjob = new jobcoll({
        "title": "Developer needed to create online course",
        "createdOn": "2019-02-11T14:01:24+00:00",
        "type": 2,
        "ciphertext": "~01e6e56f44c5190e54",
        "description": "I will be creating a website using Wordpress. I would like to create and sell an online course that teaches children ages 7-10 how to do cursive. Students participating in the course will watch short videos and would be able to download pdf worksheets for each letter. Listed below are the features I am looking to implement:\n\nSelling the course to an individual for a yearly membership.\nSelling the course to a teacher..Once the teacher purchases the course they would be able to input 30 students. Each student would be able to easily log in and participate in their own course.\nEach course would show the progress that student is making.\nStudents could print out completion certificates when finished with a section.\nI would like it for the kids to not have to type in an email. They just go to their class, click on their name, type in a common password, and go. I have attached an example picture of what I would like.\n\n\n\nI have most of the videos already created, and can use Wordpress to create site.\n\nWould you be able to do this?",
        "category2": "Web, Mobile & Software Dev",
        "subcategory2": "Web Development",
  });
  docjob.save(function(err) {  
    console.log('err:', err);
    res.json({ a: 1 });
  });
});

app.listen(app.get('port'), function () {
  console.log('Server listening on port ' + app.get('port'));
});
