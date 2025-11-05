import { useState, useEffect } from 'react'
import Editor from '@monaco-editor/react'
import '../app.css';
import socket from './socket';



export const LANGUAGES = {
  python: "3.10.0",
  javascript: "18.15.0",
  java: "15.0.2",
};

const CodeBox = ({roomUuid, refBox, lang, setLang}) => {
   const[value,setValue] = useState('')
   const onMount = (box) =>{
      refBox.current = box
      box.focus()
   }
   const codeEmit = (val)=>{
      setValue(val)
      socket.emit('coding',{roomUuid,code:val});
   }
   const langEmit = (e)=>{
      setLang(e.target.value);
      socket.emit("lang-change",{roomUuid,language:e.target.value});
   }
   useEffect(()=>{
        socket.on('coding',(code) =>{
          setValue(code);
        })
        socket.on("lang-change", (language) =>{
          setLang(language)
        })
   
        return () => {
          socket.off('coding');
          socket.off('lang-change');
        };
      }, [roomUuid]);
   return (
         
      <div id ="code-div">
         <select id="select-menu" value={lang} onChange={langEmit}>
            {Object.entries(LANGUAGES).map(([key, version]) => (
            <option key={key} value={key}> 
               {key} ({version})
            </option>
            ))}
         </select>
         <Editor 
         height="60vh" 
         width="97.4%"
         theme = "vs-dark" 
         language= {lang}
         onMount ={onMount}
         value = {value || ''} 
         onChange={codeEmit}
         />
         
      </div>
  )
}

export default CodeBox