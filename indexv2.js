'use strict';

var listeningport = process.env.PORT || 3000;

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// const server = app.listen(process.env.PORT || 5000, () => {
//   console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
// });

app.listen(listeningport, function () {
console.log('BOT listening at ...' + listeningport);
});

app.get('/', function (req, res) {
res.send('Validation tsting GET METHOD...');
});



app.post('/slotfillv2', (req,res) => {

  console.log('*** Webhook V2 for slotfill query ***');
  //console.log(req.body.result);


//Change to queryresult from result for V2 changes

  if (req.body.queryResult.action === 'a_fetch_user_details') {

    console.log('Fetch user action fired V2');


      if (req.body.queryResult.parameters['UserName'] != ''){
        console.log('User name entered - ' + req.body.queryResult.parameters['UserName']);

        return res.json({
                  // speech: "Fetched User details.",
                  fulfillmentText: "Thank you for your order..",
                  //displayText: "Fetched user details.. ",
                  fulfillmentMessages : [
                          {
                            "text": {
                              "text": [
                                "Thank you for your order"
                              ]
                            }
                          }
                        ],
                  // followupEvent : {
                  followupEventInput : {
                  //"data" : {
                  "parameters" : {
                    "pizzatype" : req.body.queryResult.parameters['pizzatype'],
                    "pizzasize": req.body.queryResult.parameters['pizzasize'],
                    "UserName" : req.body.queryResult.parameters['UserName'],
                    "address1" : "Woodlands Drive 73",
                    "address2" : "Singapore",
                    "phoneno" :"6512345678",
                    "myemail" :"someone@somewhere.com"
                  },
                  name : "e_fetch_user_details"

                  },
                  //contextOut: ['GET-PIZZA-SIZE'],

          });

      }


  }

  //Still Version 1 sysntax...You may change to V2 syntax based on the above code as an exercise for you
  else if (req.body.result.action === 'a_fetch_pwd') {

    console.log('Fetch user action fired');
      if (req.body.result.parameters['UserName'] != ''){
        console.log('User name entered');

            var options = {
              sessionId:  '25',
              contexts: [
                  {
                      name: 'cnt_pwd',
                      parameters: {
                          'UserName' : req.body.result.parameters['UserName'],
                          'pwd' : '1233',

                      }
                  }
                ]
                };

                var req_result = apiaiApp.textRequest('Your password is', options);
          }
      }

});


app.post('/validatev2', (req,res) => {

  console.log('*** Webhook for Validating user input - V2 ***');
  //console.log(req.body.result);


  if (req.body.queryResult.action === 'CHECK-PIZZA-SIZE') {

    console.log('Action CHECK PIZZA SIZE recognised..');
    let pizzasize = req.body.queryResult.parameters['size'];

    if(pizzasize != 12 && pizzasize != 18){

      console.log('Webhook Firing Pizza Invalid Event');

          return res.json({
            fulfillmentText: "Invalid Pizza Size",

            fulfillmentMessages : [
                    {
                      "text": {
                        "text": [
                          "InValid Pizza size"
                        ]
                      }
                    }
                  ],
                    followupEventInput : {
                    name : "pizza-size-invalid"

                    },

                    source: "from V2"
            });

      }
      else {

        console.log('Webhook Firing Pizza VALID Event');
        return res.json({
          fulfillmentText: "Valid Pizza Size",

          fulfillmentMessages : [
                  {
                    "text": {
                      "text": [
                        "Valid Pizza size"
                      ]
                    }
                  }
                ],
                  followupEventInput : {
                  name : "pizza-size-valid"

                  },

                  source: "from V2"
          });
      }



  }




});




