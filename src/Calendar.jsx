import { useEffect, useRef, useState } from "react";
import { motion, animate } from "framer-motion"
import Day from "./Day";
import Month from "./Month";
import $ from 'jquery'
import Month01 from "./components/Month01";

const Calendar = () => {
  const [isSelect, setSelect] = useState("") 
  const [isType, setType] = useState("miesiąc")
  const [isDate, setDate] = useState(() => {
    const date = new Date();
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    };
  });
  const [isAppointments, setAppointments] = useState([]) 

  const myComponentRef = useRef();
  const DayRef = useRef();

  const Months = [
    "Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec",
    "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"
  ];
  const Days = [
    "Niedziela", "Poniedziałek", "Wtorek", "Środa",
    "Czwartek", "Piątek", "Sobota"
  ];
  // 🔹 Czysta funkcja
  const getTypeValue = () => isType === "Dzień" ? 1 : 0;

  // 🔹 Zmiana typu
  const changeType = (e) => {
    if (e === 0) setType("Dzień");
    else if (e === 1) setType("miesiąc");
  };

  const handleValueChange = (newValue) => {
    console.log(newValue)
    setSelect(`${newValue}.${isDate.month}.${isDate.year}`);
    setDate({ ...isDate, day: newValue });
    changeType(0);
  };

  const WhoseDayisit = () => {
    const NN = new Date(isDate.year, isDate.month - 1, isDate.day).getDay();
    console.log(NN, isDate);
    return NN;
  };

  const daysInMonth = () => {
    return new Date(isDate.year, isDate.month, 0).getDate();
  };

  const setIndex = (e) => {
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

  // 🔁 Aktualizacja isSelect przy zmianie daty
  useEffect(() => {
    console.log(isDate.day)
    setSelect(`${isDate.day}.${isDate.month}.${isDate.year}`)
  }, [isDate]);

  // 🔁 Pobieranie danych przy dniu i typie
  useEffect(() => {
    if (getTypeValue() === 1) {
      const send = JSON.stringify({
        "year": isDate.year,
        "month": isDate.month,
        "day": isDate.day
      });

      $.ajax({
        url: "http://localhost:3003/api/checkapphours",
        type: "POST",
        data: send,
        crossDomain: true,
        headers: {
          "accept": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        xhrFields: { cors: false },
        contentType: "application/json; charset=utf-8",
        dataType: "json",
      }).then((res) => {
        console.log(res)
        setAppointments(res)
      }).catch((err) => {
        console.log(err)
      })
    }
  }, [isDate.day, isType]);

  return (
    <div className="w-full h-[100vh] flex justify-center items-center relative">
      <div className="p-4 flex flex-col min-w-[50vw] w-full">
        <div className="flex justify-center items-end mb-4 mx-4">
          <div className={`rounded-[20px] flex flex-col w-auto items-center ease-in-out duration-200 font-Poppins ${
            getTypeValue() === 0 ? "relative" : "absolute left-5 wl-l top-[50%] translate-y-[-50%] w-auto"
          }`}>
            <p onClick={() => changeType(1)} className={`cursor-pointer absolute font-Poppins font-bold text-[clamp(30px,9vw,190px)] z-0 text-[#121212] ${
              getTypeValue() === 0 ? "translate-y-[-40%]" : "translate-x-[-20%]"
            }`}>{isDate.year}</p>
            <p className="font-bold text-[70px] font-Poppins text-[#DBDBDB] relative z-[1]">{Months[isDate.month - 1]}</p>
          </div>
          <p className="font-bold text-[70px] font-Poppins text-[#DBDBDB] relative z-[1]">
            {getTypeValue() === 0 ? null : Days[WhoseDayisit()] }
          </p>
        </div>

        <div id="mainTable" className="w-full">
          {getTypeValue() === 1 ? (
            <Day appointments={isAppointments} type={getTypeValue} date={isDate} />
          ) : (
            <Month01 ref={myComponentRef} selectValue={handleValueChange} date={isDate} />
          )}
        </div>

        <div className="flex items-center w-full justify-center mt-10">
          <div onClick={() => setIndex("prev")} className="bg-[#323232] active:bg-[#ccc] ease-in-out duration-100 rounded-full p-2 cursor-pointer">
            <i className="gg-chevron-left invert"></i>
          </div>
          <div className="px-4 py-1 mx-2 font-Poppins text-[20px] text-white">{isType}</div>
          <div onClick={() => setIndex("next")} className="bg-[#323232] active:bg-[#ccc] ease-in-out duration-100 rounded-full p-2 cursor-pointer">
            <i className="gg-chevron-right invert"></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
