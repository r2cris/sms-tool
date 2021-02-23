//imports
const fetch = require('node-fetch');
const fs = require('fs');
var twilio = require('twilio');
const bodyParser = require('body-parser');
const express = require('express');
const { check, validationResult } = require('express-validator');
const app = express();
const port = process.env.port || 3000;
const url = 'https://api.followupboss.com/v1/people/';
const options = {
    method: 'GET',
    qs: {sort: 'created', limit: '100', offset: '0', includeTrash: 'false'},
    headers: {Authorization: 'basic Mzg1ZjEyODFlOTgzZDA4YTIzMmI0ZDY4MDc5NTM2NTAyOTFkZjQ6',
            'X-System': 'sms-tool',
            'X-System-Key': '813c0821c64df59a22e2167ce1ae0caf'}
  };

var accountSid = 'ACcd3c3a10088e9bf2cb1691566533732a'; // Your Account SID from www.twilio.com/console
var authToken = '82e677d75b79a8651980fd1a4a9d143a';   // Your Auth Token from www.twilio.com/console
var client = new twilio(accountSid, authToken);
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const { Buffer } = require('buffer');
const { off } = require('process');
var list = [];
var listname;
var sendToeveryone = false;
//this get the list from follow up 
let data
async function getList(){
    try{
        var responseFUB = fetch(url,options).then(res => res.json());
        templist = await responseFUB;
        
        //list.peoples = templist.peoples;                
        var totalClients = templist._metadata.total;
        for (let index = 100; index < 1000; index += 100) {
            console.log(index);
            const optionsloop = {
                method: 'GET',
                qs: {sort: 'created', limit: 100, offset: (index - 100), includeTrash: 'false'},
                headers: {Authorization: 'basic Mzg1ZjEyODFlOTgzZDA4YTIzMmI0ZDY4MDc5NTM2NTAyOTFkZjQ6',
                        'X-System': 'sms-tool',
                        'X-System-Key': '813c0821c64df59a22e2167ce1ae0caf'}
              };
            var responseFUBloop = fetch(url,optionsloop).then(res => res.json());
            templistloop = await responseFUBloop;
            data += JSON.stringify(templistloop.people);
        }
        fs.writeFileSync('C:/Users/crist/Desktop/json/list-json.json', data);

                        
    }catch(e){
        //how to handle error
        console.error('error: ' + e);
    }
    

}
getList();


// Set Templating Enginge
app.set('view engine', 'ejs')

const urlencodedParser = bodyParser.urlencoded({ extended: false })

// Navigation
app.get('/', (req, res)=> {
    res.render('index');

});


app.post('/',  urlencodedParser,function(req, res) {

        res.render('index');
        switch(req.body.list){
            case "all":
                    sendToeveryone = true;
                break;
            case "champion_school":
                listname = "#ChampionSchool";
             break;
             case "supercompensation_system":
                 listname = "#SupercompensationSystem";
             break;
             case "fast_twitch_activation":
                 listname = "Fast Twitch Activation";
                break;
        }    
        console.log("atom"); 
        if(!sendToeveryone){
            for (let i = 0; i < list.people.length; i++) {
           
                for (let j = 0; j < list.people[i].tags.length; j++) {
                    console.log("beta");
                    if (list.people[i].tags[j] == listname){
                        console.log("....." + i +"......");
                        console.log(list.people[i]);
                    }
                    
                }
            }
            }else{
                /*var phonesForTest = ["+58 414-3250167","+58 414-1916645","+1 (919) 797-4476",
                "+58 414-1017359","+593 98 739 1241","+57 322 6598005",
                "+58 414-9017156","+593 99 511 3046","+57 316 5219348",
                "+58 414-2715411","+56 9 3419 9454","+58424 1205152", 
                "+58(424) 297-5551"];*/
                var phonesForTest = ["+1(916) 888-8430 "];

                for (let index = 0; index < phonesForTest.length; index++) {
                   /* client.messages.create({
                        body: req.body.message,
                        to: phonesForTest[index],  // Text this number
                        from: '+15102161637' // From a valid Twilio number
                    })
                    .then((message) => console.log(message.sid));*/
                    
                }
                sendToeveryone = false;
               
            }            
        }
           
    
    );

    app.post('/sms', (req, res) => {
        const twiml = new MessagingResponse();
        const message = twiml.message();
        message.body('Your message has been received, We will contact you very soon.');      
        res.writeHead(200, {'Content-Type': 'text/xml'});
        res.end(twiml.toString());
      });
// Listen on Port 5000
app.listen(port, () => console.info(`App listening on port ${port}`));
//function onRequest(request,response){
  //  if(request.method = "GET"){
      //  response.writeHead(200,{'Content-Type':'text/html'});
       // fs.readFile('./index.html',null,function(error,data){
        //if(error){ response.writeHead(404);response.write('File not found');}else{response.write(data);}
        //response.end();
   // });
    //}else if(request.method = "POST"){
  //      console.log('is posting');
    //}
//}
