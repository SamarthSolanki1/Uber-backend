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
        
        socket.on('join', async (data) => {
            const { userId, userType } = data;
            console.log(`🔗 User connected: ${userId} as a ${userType}, updating socketId...`);
        
            try {
                if (userType === 'user') {
                    await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
                    const updatedUser = await userModel.findById(userId);  // ✅ Fetch the updated user
                    console.log(`✅ Updated User Socket ID: ${updatedUser.socketId}`);  // 🔍 Verify socketId
                } else if (userType === 'captain') {
                    await captainmodel.findByIdAndUpdate(userId, { socketId: socket.id });
                    const updatedCaptain = await captainmodel.findById(userId);  // ✅ Fetch the updated captain
                    console.log(`✅ Updated Captain Socket ID: ${updatedCaptain.socketId}`);  // 🔍 Verify socketId
                }
            } catch (error) {
                console.error("❌ Error updating socketId:", error);
            }
        });
        

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

function sendMessageToSocketId(socketId, messageObject) {
    if (!socketId) {
        console.log("❌ Error: Socket ID is undefined, event not sent:", messageObject.event);
        return;
    }

    if (io) {
        console.log(`✅ Sending event '${messageObject.event}' to socketId:`, socketId);
        io.to(socketId).emit(messageObject.event, messageObject.data);
    } else {
        console.log("❌ Error: Socket.io not initialized.");
    }
}


export { initializeSocket, sendMessageToSocketId };
