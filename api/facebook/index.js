/**
 * https://developers.facebook.com/docs/messenger-platform/getting-started/quick-start/
 *
 * To run this code, you must do the following:
 *
 * 1. Deploy this code to a server running Node.js
 * 2. Run `npm install`
 * 3. Update the VERIFY_TOKEN
 * 4. Add your PAGE_ACCESS_TOKEN to your environment vars
 */
const facebookRouter = require('express').Router();
const {
  handleMessage,
  handlePostback,
} = require('./handlingFunctions');

// Verification handling (by facebook)
facebookRouter.get('/webhook', (req, res) => {
  /** UPDATE YOUR VERIFY TOKEN **/
  const VERIFY_TOKEN = process.env.FACEBOOK_VERIFY_STRING;
  
  // Parse params from the webhook verification request
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];
    
  // Check if a token and mode were sent
  if (mode && token) {
    // Check the mode and token sent are correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      
      // Respond with 200 OK and challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
      return;
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
      return;
    }
    return;
  }
  res.status(403).send({
    error: {
      message: 'Algo salió mal.'
    }
  });
});

// Accepts POST requests at /webhook endpoint
facebookRouter.post('/webhook', (req, res) => {
  // Parse the request body from the POST
  let { body } = req;

  // Return a '404 Not Found' if event is not from a page subscription
  if (body.object !== 'page') {
    res.sendStatus(404);
    return;
  }

  body.entry.forEach(function(entry) {
    // Gets the body of the webhook event
    let webhook_event = entry.messaging[0];
    console.log(webhook_event);
    // Get the sender PSID
    let sender_psid = webhook_event.sender.id;
    console.log('Sender ID: ' + sender_psid);
    // Check if the event is a message or postback and
    // pass the event to the appropriate handler function
    if (webhook_event.message) {
      handleMessage(sender_psid, webhook_event.message);        
    } else if (webhook_event.postback) {
      handlePostback(sender_psid, webhook_event.postback);
    }
  });
  // Return a '200 OK' response to all events
  res.status(200).send('EVENT_RECEIVED');
});

module.exports = facebookRouter;