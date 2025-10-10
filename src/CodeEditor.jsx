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
    <div>
      <div id="app-div">
        <CodeBox roomUuid = {roomUuid} refBox={refBox} lang={lang} setLang={setLang}></CodeBox>
        <Terminal roomUuid = {roomUuid} refBox={refBox} lang={lang}></Terminal>
      </div>
    </div>
  );
}

export default CodeEditor