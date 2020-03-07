const feathers = require('@feathersjs/feathers');
const express  = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');
const moment   = require('moment');
let bodyParser = require('body-parser');
const PORT     = process.env.PORT || 3030;

const app      = express(feathers());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Parse JSON
app.use(express.json());

// Config Socket.io realtime APIs
let socket = app.configure(socketio(function(io) {
  io.on('connection', function(socket) {
  	socket.on('upload_new_form', function (data) {
      socket.broadcast.emit(`publish_unified_form`, data);
    });
  });
}));

// Enable REST service
app.configure(express.rest());

// New connections connect to stream channel
app.on('connection', conn => app.channel('stream').join(conn));
// Publish events to stream
app.publish(data => app.channel('stream'));


app.post('/upload/form', (req, res) => {
	socket.io.emit(`publish_unified_form`, req.body);
	return res.status(200).json({
        code : 200,
        status : 'success'
   });
});


app.listen(PORT).on('listening', _ => console.log(`Realtime server running on port ${PORT}`) );
