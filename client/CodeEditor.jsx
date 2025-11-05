import { useRef, useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import './app.css'
import CodeBox from './elements/CodeBox';
import Terminal from './elements/Terminal';
import socket from './elements/socket';

const CodeEditor= () => {
  const navigate = useNavigate()
  const { roomUuid } = useParams()
  const refBox = useRef()
  const[lang, setLang] = useState('python');
  const[name, setName] = useState('')
  useEffect(()=>{
    socket.emit('join-room', roomUuid);
    socket.on('join-room',() =>{
      const userEnter = document.createElement('p')
      userEnter.textContent = `A user has joined the room!`
      document.getElementById("chat-log").appendChild(userEnter)
    })
    socket.on('full-room',() =>{
      alert("Room full :/ Create new room to code with friends!")
      navigate("/");
    })
    socket.on('chat-box',({name, message}) =>{
      console.log(name)
      const messageText = document.createElement('p')
      messageText.textContent = `${name}:` + message;
      document.getElementById("chat-log").appendChild(messageText)
    })
    return () => {
      socket.off('join-room');
      socket.off('chat-box');
      socket.off('full-room');
      socket.disconnect()
    };
  }, []);


  const setNameFunc = () =>{
    if(!name){
      alert("Name Cannot Be Blank")
      return;
    }
    if(/\s/.test(name)){
      alert("White spaces not allowed")
      document.getElementById('name-input').value = '';
      return;
    }
    if(name.length>13){
      alert("Max length of 13 characters for name")
      document.getElementById('name-input').value = '';
      return;
    }
    document.getElementById('name-input').style.display = 'none';
    document.getElementById('name-input-enter').style.display = 'none';
  }
  
  const sendMsg = () =>{
    const msgInput = document.getElementById("chat-input")
    if(!name){
      alert("Set Name Before Messaging")
      msgInput.value = "";
      return;
    }
    console.log("My message:" + msgInput)
    if(!msgInput){return}
    const msg = msgInput.value.trim()
    if(msg){
      const messageText = document.createElement('p')
      messageText.textContent = `Me:` + msg;
      document.getElementById("chat-log").appendChild(messageText)
      socket.emit('chat-box',{roomUuid,name, message:msg})
      console.log(msg)
      msgInput.value="";
    }
  }


  return (    
    <div id ="code-editor">
      <div id="app-div">
        <CodeBox roomUuid = {roomUuid} refBox={refBox} lang={lang} setLang={setLang}></CodeBox>
        <Terminal roomUuid = {roomUuid} refBox={refBox} lang={lang}></Terminal>
      </div>
      <div id ="msg-board">
        <br></br>
        <input id="name-input" type = 'text' placeholder='Enter name to message...' onChange={(e) => setName(e.target.value)} ></input><button id="name-input-enter" onClick = {setNameFunc}>ENTER</button>
        <div id="chat-log">
          <p style={{color:'red',fontStyle:'italic'}}>Share URL above to collaborate with another user!</p>
          </div>
        <input id="chat-input" type = 'text' placeholder='Send message to interact...'></input> <img id="enter-btn"src="/enter.png" onClick={sendMsg}></img>

      </div>
    </div>
   
  );
}

export default CodeEditor