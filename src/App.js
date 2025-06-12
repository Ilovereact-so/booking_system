import { useEffect, useRef, useState } from "react";
import { motion, animate } from "framer-motion"
import Day from "./Day";
import Month from "./Month";
import $ from 'jquery'
import Hero from "./components/Hero";
import Calendar from "./Calendar";
import Calendar01 from "./components/Calendar01";

const App = ()=> {  
  
return(
  <div>
    <header className="h-[100vh] w-full bg-[#1d1c1c]">
      <Hero/>
    </header>
    <section className="bg-[#1D1C1C]">
      <Calendar01/>
    </section>
  </div>
)
  
}



export default App;
