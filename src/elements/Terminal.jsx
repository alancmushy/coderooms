import { useState,useEffect } from 'react';
import '../app.css';
import { runCode } from '../api';
import socket from './socket';



const Terminal = ({roomUuid, refBox,lang}) => {
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
      socket.emit('run-code',{roomUuid,terminal:result.output});
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
        socket.on('run-code',(terminal) =>{
          setOutput(terminal);
        })
        return () => {
          socket.off('run-code');
        };
    }, [roomUuid]);

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