import React, { useState } from 'react'
import Editor from '@monaco-editor/react'
import '../app.css';
export const LANGUAGES = {
  python: "3.10.0",
  javascript: "18.15.0",
  java: "15.0.2",
};

const CodeBox = ({refBox,lang,setLang}) => {
   const[value,setValue] = useState('')
   const onMount = (box) =>{
      refBox.current = box
      box.focus()
   }

   return (
         
      <div id ="code-div">
         <select id="select-menu" value={lang} onChange={(e) => setLang(e.target.value)}>
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
         value = {value} 
         onChange={(value,) => setValue(value)}
         />
         
      </div>
  )
}

export default CodeBox