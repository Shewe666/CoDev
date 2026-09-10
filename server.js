//creating an express server 
import express from 'express'; //importing express;
import http from 'http';
const app = express();

import { Server } from 'socket.io';
import ACTIONS from './src/Action.js';
import cluster from 'cluster';

const server = http.createServer(app);//iske andar express ka server pass krenge 



// const io = new Server(server) ; // the server class we have imported uska instance banaya hai and usme server pass kia hai 

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});
const userSocketMap={};
function getAllConnectedClients(roomId){
    //map
   return  Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId)=>{
        //har iteration pe ek client milega
        return {
            socketId,
            username:userSocketMap[socketId]
        }
   })
    

}

io.on('connection',(socket)=>{ 
    console.log('socket connected', socket.id);
    socket.on(ACTIONS.JOIN ,({roomId, username})=>{
        //konsi socket id konse username ki hai
        userSocketMap[socket.id]= username//
        socket.join(roomId); 
        const clients = getAllConnectedClients(roomId)
        clients.forEach(({socketId})=>{
            io.to(socketId).emit(ACTIONS.JOINED,{
                clients,
                username,
                socketId:socket.id,
            });
        })
    })
})


const PORT= process.env.PORT || 5000
server.listen(PORT, ()=>console.log(`Listening on port ${PORT}`))

