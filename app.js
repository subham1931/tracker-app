const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const socketio = require('socket.io');
const http = require('http');
const server = http.createServer(app); // Create the HTTP server with Express app
const io = socketio(server); // Attach Socket.IO to the server

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public'))); // Use 'app.use' instead of 'app.set' for static files
app.use(express.static('public'));

io.on('connection', function (socket) {
    socket.on('send-location', function(data){
        io.emit("recive-location", { id: socket.id, ...data }); 
        console.log(`'New user connected' ${socket.id}`);
    });
    socket.on("disconnect", function(){
        io.emit("user-disconnected", socket.id);
    })
});


app.get('/', (req, res) => {
    res.render('index');
});

server.listen(port, () => { // Use 'server.listen' instead of 'app.listen'
    console.log(`Server is running on port ${port}`);
});
