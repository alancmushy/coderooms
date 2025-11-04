import express from 'express';
import http from 'http';
import path from "path";
import {Server} from 'socket.io';
import {v4 as uuidv4} from 'uuid';
import cors from 'cors';
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const server = http.createServer(app);

app.use(cors());


let countByRoom = {}
let roomCode = {}

app.use(express.static(path.join(__dirname, "dist")));


app.get('/createRoom',(req,res)=>{
   const roomUuid = uuidv4()
   res.send({ roomUuid })
})


app.get("/{*any}", (req, res) => {
  res.sendFile(path.resolve(__dirname, "dist", "index.html"));
});

const io = new Server(server, {
  cors: {
    origin: "https://coderooms-28v9.onrender.com", 
    methods: ["GET", "POST"],
  },
});

io.on('connection',(socket)=>{
   
   socket.on("join-room", (roomUuid) =>{
      if(!countByRoom[roomUuid]){
         countByRoom[roomUuid]=0
      }
      if(countByRoom[roomUuid]>=3){
         console.log("Too many users in one room!")
         //full room, kicks out sockets that go past threshold of 3 concurent users
         socket.emit("full-room","Only 3 users allowed concurrently")
         return;
      }
      
      socket.join(roomUuid);

      //setting up the socket's roomUuid, updating the count of the room, socket's user number, and emitting existent code
      socket.data.roomUuid = roomUuid
      countByRoom[roomUuid]++;
      socket.data.userNum = countByRoom[roomUuid];
      if(roomCode[roomUuid]){
         //display previously written code to newly joined socket
         socket.emit('coding',roomCode[roomUuid]);
      }
   
      console.log(`Socket ${socket.id} has joined room ${socket.data.roomUuid}`);
      console.log(`${roomUuid} has ${countByRoom[roomUuid]} users online right now`)
   })
   //for when language change occurs between any of the users, emitted to both users concurrently
   socket.on("lang-change",({roomUuid,language}) =>{
      socket.to(roomUuid).emit('lang-change',language)
   });
   //for real-time coding updates within the coding space, emitted to both users concurrently
   socket.on('coding', ({roomUuid,code}) => {
      roomCode[roomUuid] = code;
      socket.to(roomUuid).emit('coding', code);
   })
   //for when code is ran between any of the two users, emitted to both users concurrently
   socket.on('run-code',({roomUuid,terminal}) =>{
      socket.to(roomUuid).emit('run-code',terminal);
   })
   //for side chat box, for users to interact whilst coding
   socket.on('chat-box',({roomUuid,name, message}) =>{
      const userNumber = socket.data.userNum
      socket.data.name = name;
      socket.to(roomUuid).emit('chat-box',{name, message,userNumber});
   });
   //for room disconnection
   socket.on("disconnect", () => { 
      socket.to(socket.data.roomUuid).emit('chat-box',{name:socket.data.name,message:' HAS LEFT THE ROOM',userNumber:0})
      countByRoom[socket.data.roomUuid]--; 
      console.log(`${socket.data.roomUuid} has ${countByRoom[socket.data.roomUuid]} users in the room`) 
   }); 
});

server.listen(3000,() =>{
   console.log('listening on 3000')
})