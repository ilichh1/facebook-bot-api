const request = require('request');
const Product = require('../../models/product');
const PAGE_ACCESS_TOKEN = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

function handleMessage(sender_psid, received_message) {
  let response;
  // Checks if the message contains the "text" key
  if (received_message.text) {    
    // Create the payload for a basic text message, which
    // will be added to the body of our request to the Send API
    response = {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "generic",
          "elements": [{
            "title": "\n¡Bienvenido!",
            "subtitle": "¿Quiere ver nuestro cátalogo de productos?",
            // "image_url": attachment_url,
            "buttons": [
              {
                "type": "postback",
                "title": "¡Sí! 😉",
                "payload": "ver_productos",
              },
              {
                "type": "postback",
                "title": "¡No! 😞",
                "payload": "no_hacer_nada",
              }
            ],
          }]
        }
      }
    }
  }// End 'if'
  
  /* // If the received message has attachments:
  if (received_message.attachments) {
    // Get the URL of the message attachment
    let attachment_url = received_message.attachments[0].payload.url;
    response = {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "generic",
          "elements": [{
            "title": "Is this the right picture?",
            "subtitle": "Tap a button to answer.",
            "image_url": attachment_url,
            "buttons": [
              {
                "type": "postback",
                "title": "Yes!",
                "payload": "yes",
              },
              {
                "type": "postback",
                "title": "No!",
                "payload": "no",
              }
            ],
          }]
        }
      }
    }
  } */
 
  // Send the response message
  callSendAPI(sender_psid, response);    
}

function handlePostback(sender_psid, received_postback) {
  console.log('Handling a Postback!');
  const response = {};
  // Get the payload for the postback
  let { payload } = received_postback;

  // Set the response based on the postback payload
  // if ( === 'yes') {
  //   response = { "text": "Thanks!" }
  // } else if (payload === 'no') {
  //   response = { "text": "Oops, try sending another image." }
  // }

  switch(payload) {
    case 'ver_productos':
      getAllProducts()
      .then(products => {
        // response['text'] = text;
          response['attachment'] = {
            type: 'template',
            payload: {
              template_type: 'generic',
              elements: products.map(dbProductToFacebookMessage)
            }
        };
        callSendAPI(sender_psid, response);
      });
      return;
    default:
      response['text'] = 'Uh! Lo siento, no te entendí.'
  }

  // Send the message to acknowledge the postback
  callSendAPI(sender_psid, response);
}

function callSendAPI(sender_psid, response) {
  // Construct the message body
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": response
  }
  // Send the HTTP request to the Messenger Platform
  request({
    "uri": "https://graph.facebook.com/v2.6/me/messages",
    "qs": { "access_token": PAGE_ACCESS_TOKEN },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('message sent!')
    } else {
      console.error("Unable to send message:" + err);
    }
  }); 
}

function dbProductToFacebookMessage(product) {
  return {
    title: product.name,
    subtitle: product.description,
    image_url: product.image,
    buttons: [{
      type: 'postback',
      title: 'Más información',
      payload: `more_info_product_${product['_id']}`
    }]
  };
}

function getAllProducts() {
  return Product.find()
    .then(p => p)
    .catch(error => {
      console.log('DB ERROR: ', error);
      return Promise.resolve([{name: 'Producto por default'}]);
    });
}

function getAllProductsAsCsv() {
  return Product
    .find()
    .then(products => {
      return Promise.resolve(productsArrayToCommaSeparatedString(products));
    })
    .catch(error => {
      console.log('DB ERROR: ', error);
      return Promise.resolve('Oops! algo salió mal');
    });
}

function productsArrayToCommaSeparatedString(productsArray) {
  return productsArray
    .map(product => {
      if (!product.name) {
        return 'Producto sin nombre';
      }
      return product.name;
    })
    .join(', ');
}

module.exports = {
  handleMessage,
  handlePostback,
  callSendAPI
};