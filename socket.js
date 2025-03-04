import { Server } from "socket.io";
import userModel from "./models/user.model.js";
import captainmodel from "./models/captain.model.js";
let io;

function initializeSocket(server) {
    io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });

    io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`);
        
        socket.on('join',async(data) => {
            const {userId,userType} = data;
            console.log(`user connected: ${userId} as a ${userType}`)
            if(userType === 'user' ){
                await userModel.findByIdAndUpdate(userId,{
                    socketId: socket.id
                })
            }else if(userType === 'captain'){
                await captainmodel.findByIdAndUpdate(userId,{
                    socketId: socket.id
                })
            }
        })

        socket.on('update-location-captain',async(data) => {
            const {userId,location} = data
            console.log(`user updated tp location : ${location} `)
            if(!location || !location.ltd || !location.lng){
               return socket.emit('error',{message: 'Invalid location'})
            }
            await captainmodel.findByIdAndUpdate(userId,{location})
        })

        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });
}

function sendMessageToSocketId(socketId, message) {
    if (io) {
        io.to(socketId).emit('message', message);
    } else {
        console.log('Socket.io not initialized.');
    }
}

export { initializeSocket, sendMessageToSocketId };
