import React from 'react'
import { BrowserRouter, Routes, Route, useNavigate} from "react-router-dom";
import './app.css'
import CodeEditor from './CodeEditor';

const Home = () =>{
  const navigate = useNavigate()
  const createRoom = async () =>{
    const res = await fetch("https://coderooms-28v9.onrender.com/createRoom")
    const data = await res.json();
    navigate(`/room/${data.roomUuid}`)
  }
  return (
      <div id = "home-page">
        <div className ="titles">
          <h1 style={{ fontFamily: "'Fira Code', Consolas, 'Courier New', monospace", fontWeight: 100, fontSize: '4rem'}}>C O D E R O O M S</h1>
          <h2>The Premier Collaborative Coding Space </h2>
          <h3>Create, Build, and Collaborate code Between Two Users to Make a Seamless Shared Space</h3><br></br><br></br>
          <button id="btn-home-page" onClick = {createRoom}> CREATE ROOM </button><br></br><br></br>
        </div>
        <img id="img-terminal"src="term.png"></img>
      </div>
      
  )
}

const App= () => {
  return (
   <BrowserRouter>
      <Routes>
         <Route path="/" element={<Home />} /> 
         <Route path = "/room/:roomUuid" element={<CodeEditor />} />
      </Routes>
   </BrowserRouter>
  );
};



export default App