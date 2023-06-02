const path = require('path');
const http = require('http');
const express = require('express'); // express server
const socketio = require('socket.io');
const formatMessages = require('./utils/messages');
const { userJoin, getCurrentUser, userLeaves, getRoomsUsers } = require('./utils/user');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const room = express(); //---
const username = express();

//set static(main) folder
app.use(express.static(path.join(__dirname, 'public')));
const Admin = 'Admin'; //  Admin = 'ChatCord Bot' 
// Run when client connects
io.on('connection', socket => {
    console.log('New Client Connecting...'); // show in terminal
    socket.on('joinRoom', ({ username }, { room }) => {
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);

        // show in inspect in web browser
        socket.emit('message', formatMessages(Admin, 'welcome to ChatMeet!'));    //use for single client

        //broadcast when a user connects
        socket.broadcast.to(user.room).emit('message', formatMessages(Admin, `${user.username} has joined the chat`));

        // Send user and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomsUsers(user.room)
        });

    });

    //-- io.emit();  //All client
    //Listen for ChatMessage
    socket.on('chatMessage', (msg) => {
        //console.log(msg); // show in terminal
        const user = getCurrentUser(socket.id);
        //io.emit('message', formatMessages(`${user.username}`, msg));
        io.to(user.room).emit('message', formatMessages(user.username, msg));
        //io.emit('message', formatMessages('USER', msg));
    });


    //Runs when client disconnects 
    socket.on('disconnect', () => {
        const user = userLeaves(socket.id);
        if (user) {
            //io.to(user.room).emit('message', formatMessages(Admin, `${user.username} has left the chat`));
            socket.to(user.room).emit('message', formatMessages(Admin, `${user.username} has left the chat`));
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomsUsers(user.room)
            });
        }
    }
    );
});

const PORT = 3030 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));  // run server


