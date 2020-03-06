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
  	socket.on('con', function (data) {
      socket.broadcast.emit(`server_qr_attendance_${data.subject_id}_${data.instructor_id_number}`, data);
    });
  });
}));

// Enable REST service
smbasapp.configure(express.rest());

// New connections connect to stream channel
app.on('connection', conn => app.channel('stream').join(conn));
// Publish events to stream
app.publish(data => app.channel('stream'));




app.listen(PORT).on('listening', _ => console.log(`Realtime server running on port ${PORT}`) );
