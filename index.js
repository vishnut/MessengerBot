'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
    res.send('Hello world, I am a chat bot')
})

// for Facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
    	res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})

app.post('/webhook/', function (req, res) {
    let messaging_events = req.body.entry[0].messaging
    for (let i = 0; i < messaging_events.length; i++) {
        let event = req.body.entry[0].messaging[i]
        let sender = event.sender.id

        if (event.message && event.message.text) {
            let text = event.message.text
	    let rand = Math.floor(Math.random()*8)
	    if (event.attachments) {
	        sendTextMessage(sender, "This is attachment content and I don't do attachment content. Stop it. You should feel bad")
            } else if (text.includes("ode")) {
	        sendTextMessage(sender, "This is node.js content.")
	    } else if (text.includes("utin") || text.includes("ernie") || text.includes("illary")) {
	        sendTextMessage(sender, "This is communist content.")
	    } else if (text.includes("rump") || text.includes("exican") || text.includes("taco")) {
	        sendTextMessage(sender, "This is wall content.")
	    } else if (rand === 1) {
	        sendTextMessage(sender, "This is good content.")
	    } else if (rand === 2) {
	        sendTextMessage(sender, "This is bad content.")
	    } else if (rand === 3) {
	        sendTextMessage(sender, "This is content.")
	    } else if (rand === 4) {
	        sendTextMessage(sender, "This is not content.")
	    } else if (rand === 5) {
	        sendTextMessage(sender, "I don't know. Angery reacts only.")
	    } else if (rand === 6) {
	        sendTextMessage(sender, "This content should not exist.")
	    } else if (rand === 7) {
	        sendTextMessage(sender, "This is bad content and you should feel bad.")
	    } else {
	        sendTextMessage(sender, "This is sad content.")
	    }

//	    sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))	    
	    //sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200) + Math.random()*3/1)
	}
    }
    res.sendStatus(200)
})

const token = process.env.FB_PAGE_ACCESS_TOKEN

function sendTextMessage(sender, text) {
    let messageData = { text:text }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
	qs: {access_token:token},
        method: 'POST',
        json: {
               recipient: {id:sender},
               message: messageData,
        }
    }, function(error, response, body) {
       if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}
