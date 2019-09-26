const elasticsearch = require('elasticsearch');
const client = new elasticsearch.Client({
   hosts: [ 'http://localhost:9200']
});

const indexKey = 'job-luan-van';

client.ping({
     requestTimeout: 30000,
 }, function(error) {
     if (error) {
         console.error('elasticsearch cluster is down!');
     } else {
         console.log('Everything is ok');
     }
 });

 client.indices.flush({
    index: indexKey
}).then((flushed)=>{
    console.log("flushed:", flushed);
})

 client.indices.create({
     index: indexKey
 }, function(error, response, status) {
     if (error) {
         console.log(error);
     } else {
         console.log("created new index", response);
     }
 });


const jobs = require('./jobs.json');
var bulk = [];
jobs.forEach(job =>{
  bulk.push({index:{ 
                _index: indexKey, 
                _type:"jobs_list",
            }
          
        })
  bulk.push(job);
});


client.bulk({body:bulk}, function( err, response  ){ 
        if( err ){ 
            console.log("Failed Bulk operation".red, err) 
        } else { 
            console.log("Successfully imported %s".green, bulk.length); 
        } 
    }); 

