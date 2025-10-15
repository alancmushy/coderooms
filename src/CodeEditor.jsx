import { useRef, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import './app.css'
import CodeBox from './elements/codeBox';
import Terminal from './elements/Terminal';
import socket from './elements/socket';


const CodeEditor= () => {
  const { roomUuid } = useParams()
  const refBox = useRef()
  const[lang, setLang] = useState('python');
  useEffect(()=>{
        socket.emit('join-room', roomUuid);
  }, [roomUuid]);

  return (    
    <div id ="code-editor">
      <div id="app-div">
        <CodeBox roomUuid = {roomUuid} refBox={refBox} lang={lang} setLang={setLang}></CodeBox>
        <Terminal roomUuid = {roomUuid} refBox={refBox} lang={lang}></Terminal>
      </div>
      <div id ="msg-board">
        <br></br><br></br>
        <div id="chat-log"></div>
        <input id="chat-input" placeholder='Send message'></input> <img id="enter-btn"src="/enter.png"></img>

      </div>
    </div>
   
  );
}

export default CodeEditor