import React from 'react'
import { useState } from 'react';
import '../app.css';
import { runCode } from '../api';

const Terminal = ({refBox,lang}) => {
  const[output,setOutput]=useState(null)
  const run = async ()=>{
    const code = refBox.current.getValue();
    if(!code) return;
    try {
      const {run:result} = await runCode(lang, code)
      if(result.stderr !== ""){
        document.getElementById("output-code").style.color = "red"
      }else{
        document.getElementById("output-code").style.color = "white"
      }
      setOutput(result.output)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div id="termainalandrun-div">
      <img id="run-btn" src="run.png" width="15" height="15" onClick={run}></img>
      <div id="terminal">
        <p id ="output-code">@coderooms\{lang}\output&gt; {output}</p>

      </div>
    </div>
  )
}

export default Terminal