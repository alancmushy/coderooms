import express from 'express';
import http from 'http';
import {Server} from 'socket.io';
import {v4 as uuidv4} from 'uuid';
import cors from 'cors';
const app = express();
const server = http.createServer(app);

app.use(cors());

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", 
    methods: ["GET", "POST"],
  },
});

app.get('/createRoom',(req,res)=>{
   const roomUuid = uuidv4()
   res.send({ roomUuid })
})

io.on('connection',(socket)=>{
   console.log('user is online')
   //for joining a room
   socket.on("join-room", (roomUuid) =>{
      socket.join(roomUuid);
      console.log(`Socket ${socket.id} joined room ${roomUuid}`);
   })
   //for when language change occurs between any of the users, emitted to both users concurrently
   socket.on("lang-change",({roomUuid,language}) =>{
      socket.to(roomUuid).emit('lang-change',language)
   });
   //for real-time coding updates within the coding space, emitted to both users concurrently
   socket.on('coding', ({roomUuid,code}) => {
      socket.to(roomUuid).emit('coding', code);
   })
   //for when code is ran between any of the two users, emitted to both users concurrently
   socket.on('run-code',({roomUuid,terminal}) =>{
      socket.to(roomUuid).emit('run-code',terminal);
   })
   //for room disconnection
   socket.on("disconnect", () => {
      console.log("disconnected")
   });
});

server.listen(3000,() =>{
   console.log('listening on 3000')
})