import axios from "axios";
import { LANGUAGES } from "./elements/codeBox";
const API = axios.create({
   baseURL:"https://emkc.org/api/v2/piston"
})


export const runCode = async(lang, code)=>{
   const response = await API.post("/execute", {
  "language": lang,
  "version": LANGUAGES[lang],
  "files": [
    {
      "content": code,
    }
  ],

   });
   return response.data;
}