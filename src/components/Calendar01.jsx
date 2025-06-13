import React, { useEffect, useRef, useState } from 'react'
import $ from "jquery"
import Day from './Day';
import Month01 from './Month01';
import { ChevronLeft, ChevronRight, MoveLeft } from 'lucide-react';

const Calendar01 = () => {
    const [isDate, setDate] = useState(() => {
    const date = new Date();
    const lastDate = new Date(2025,date.getMonth() + parseInt(localStorage.getItem("isCounter"),10),5)
    console.log(lastDate)
    if(localStorage.getItem("isCounter") == null){
      return {
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: date.getDate(),
      }
    }else{
      return{
        year: lastDate.getFullYear(),
        month: lastDate.getMonth()+1,
        day: date.getDate()
      }
    }
    });
    const [isType, setType] = useState("miesiąc")
    const [isAppointments, setAppointments] = useState([]) 
    const myComponentRef = useRef();
    const DayComponentRef = useRef();


    const getTypeValue = () => isType === "Dzień" ? 1 : 0;

    const WhoseDayisit = () => {
        const NN = new Date(isDate.year, isDate.month - 1, isDate.day).getDay();
        console.log(NN, isDate);
        return NN;
    };

    const daysInMonth = () => {
        return new Date(isDate.year, isDate.month, 0).getDate();
    };
    const handleValueChange = (newValue) => {
        console.log(newValue, "CalendarDate")
        //setSelect(`${newValue}.${isDate.month}.${isDate.year}`);
        setDate(newValue);
        changeType(0);
    };

    const lastClickTime = useRef(0);
    const setIndex = (e) => {
        const now = Date.now();
        const delay = 300; 
        
        if (now - lastClickTime.current < delay) {
        return; 
        }
        
        lastClickTime.current = now;

    if (isType === "miesiąc") {
      if (myComponentRef.current) {
        myComponentRef.current.callInternalFunction(e);
      }
        if (e === "next") {
        if (isDate.month === 12) {
            setDate({ ...isDate, year: isDate.year + 1, month: 1 });
        } else {
            setDate({ ...isDate, month: isDate.month + 1 });
        }
        } else if (e === "prev") {
        if (isDate.month === 1) {
            setDate({ ...isDate, year: isDate.year - 1, month: 12 });
        } else {
            setDate({ ...isDate, month: isDate.month - 1 });
        }
        }
    } else {
        if (e === "next") {
          console.log("dzieeen")
          if (isDate.day < daysInMonth()) {
              setDate({ ...isDate, day: isDate.day + 1 });
          } else {
              if (isDate.month < 12) {
              setDate({ ...isDate, day: 1, month: isDate.month + 1 });
              } else {
              setDate({ ...isDate, day: 1, month: 1, year: isDate.year + 1 });
              }
          }
        } else if (e === "prev") {
        setDate({ ...isDate, day: isDate.day - 1 });
        }
    }
    };

  const observerRef = useRef(null)

  function usePageWidth() {
    const [width, setWidth] = useState(window.innerWidth)
    const observerRef = useRef(null)

    useEffect(() => {
      const handleResize = () => {
        setWidth(window.innerWidth)
      }

      const resizeObserver = new ResizeObserver(() => {
        handleResize()
      })

      resizeObserver.observe(document.body)
      observerRef.current = resizeObserver

      return () => {
        if (observerRef.current) {
          observerRef.current.disconnect()
        }
      }
    }, [])

    return width
  }
  const ViewportWidth = usePageWidth()
  let smallViewport = 690

  // 🔹 Zmiana typu
    const changeType = (e) => {
    if (e === 0) setType("Dzień");
    else if (e === 1) setType("miesiąc");
    };
    const Months = [
        "Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec",
        "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"
    ];
    const Days = [
        "niedziela", "poniedziałek", "wtorek", "środa",
        "czwartek", "piątek", "sobota"
    ];


    const [isUserMode, setUserMode] = useState("closed")

    const changeUserMode = (newValue)=>{
      setUserMode(newValue)
    }
    useEffect(async () => {
        if (getTypeValue() === 1) {

          const url = process.env.NODE_ENV == "production" ? "https://api.booking-system.wibbly.pl/api/checkapphours":"http://localhost:3003/api/checkapphours"
          try {
            // 1. Sprawdzenie dostępności terminu
            const resCheck = await fetch(url, {
              method: "POST",
              headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                year: isDate.year,
                month: isDate.month,
                day: isDate.day
              })
            });

            const resCheckData = await resCheck.json();
            if(resCheck.ok){
              setAppointments(resCheckData)
            }
          }catch (err) {
            console.log(err)
          }
        }
    }, [isDate.day, isType, isUserMode=="success"]);


  return (
    <div className="w-full min-h-[100vh] h-auto flex justify-center items-center relative">
      <div className={`p-4 flex flex-col min-w-[50vw] ${getTypeValue() === 1 ? "w-auto min-h-[80vh] justify-between":"w-full"}`}>
        <div className="flex justify-center items-end mb-4 mm:mb-8 mx-4">
          <div className={`rounded-[20px] flex flex-col w-auto items-center ease-in-out duration-200 font-Poppins ${
            getTypeValue() === 0 ? "relative" : "absolute a1:left-5 wl-l a1:top-[50%] top-[30px] a1:translate-y-[-50%] w-auto"
          }`}>
            <p onClick={() => changeType(1)} className={`cursor-pointer absolute font-Poppins font-bold  z-0 text-[#121212] ${
              getTypeValue() === 0 ? "translate-y-[-40%] text-[clamp(90px,9vw,190px)]" : "a1:translate-x-[-20%] a1:translate-y-[0] translate-y-[-40%] a1:text-[clamp(90px,9vw,190px)] text-[clamp(48px,6vw,190px)]"
            }`}>{isDate.year}</p>
            <p className={`font-bold font-Poppins text-[#DBDBDB] relative z-[1] ${
              getTypeValue() === 0 ? "text-[clamp(48px,7vw,70px)] " :"a1:text-[clamp(48px,7vw,70px)] text-[clamp(14px,3vw,60px)] "
            }`}>{Months[isDate.month - 1]}</p>
          </div>
          <div className='relative'>
            <div onClick={()=> isUserMode === "closed" ? DayComponentRef.current.callBackFunction() : null} className={`bg-[#323232] absolute top-[50%] translate-y-[-50%] 01ss:left-[-30px] left-[-15px] translate-x-[-100%] active:bg-[#ccc] ease-in-out duration-100 rounded-full p-[10px] ss:scale-[1] scale-[0.8] cursor-pointer z-10 ${
              getTypeValue() === 0 ? "hidden":"inline-block"
            }`}>
              <MoveLeft className="invert"/>
            </div>
            <p className="font-bold ss:text-[70px] text-[50px] font-Poppins text-[#DBDBDB] relative z-[1]">
              {getTypeValue() === 0 ? null : Days[WhoseDayisit()] }
            </p>
          </div>

        </div>

        <div id="mainTable" className="w-full">
            {getTypeValue() === 1 ? (
              <Day ref={DayComponentRef} appointments={isAppointments} type={changeType} userMode={changeUserMode} date={isDate} />
            ) : (
              <Month01 ref={myComponentRef} selectValue={handleValueChange} date={isDate} />
            )}
        </div>

        <div className="flex items-center w-full justify-center mt-10">
          <div onClick={() => isUserMode === "closed" ? setIndex("prev") : null} className="bg-[#323232] active:bg-[#ccc] ease-in-out duration-100 rounded-full p-2 cursor-pointer">
            <ChevronLeft className='invert'/>
          </div>
          <div className="px-4 py-1 mx-2 font-Poppins mm:text-[20px] text-[16px] text-white">{isType}</div>
          <div onClick={() => isUserMode === "closed" ? setIndex("next") : null} className="bg-[#323232] active:bg-[#ccc] ease-in-out duration-100 rounded-full p-2 cursor-pointer">
            <ChevronRight className='invert'/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Calendar01