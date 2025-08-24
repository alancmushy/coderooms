import { useRef, useState } from 'react'
import './app.css'
import CodeBox from './elements/codeBox';
import Terminal from './elements/Terminal';

const App= () => {
  const refBox = useRef()
  const[lang, setLang] = useState('python');
  return (    
    <div id="app-div">
      <CodeBox refBox={refBox} lang={lang} setLang={setLang}></CodeBox>
      <Terminal refBox={refBox} lang={lang}></Terminal>
    </div>
  );
}

export default App