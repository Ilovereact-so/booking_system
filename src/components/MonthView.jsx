import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react"
import { motion } from "framer-motion"
import {Close} from "css.gg"

const MonthView = forwardRef((props, ref) => {
    const isBasedDate = useMemo(() => {
    const now = new Date();
    let baseMonth = now.getMonth() + 1 + props.datePos;
    let baseYear = now.getFullYear();

    if (baseMonth > 12) {
      baseYear += Math.floor((baseMonth - 1) / 12);
      baseMonth = ((baseMonth - 1) % 12) + 1;
    } else if (baseMonth < 1) {
      baseYear += Math.floor((baseMonth - 1) / 12);
      baseMonth = ((baseMonth - 1) % 12 + 12) % 12 + 1;
    }

    return {
      year: baseYear,
      month: baseMonth,
      day: now.getDate(),
    };
  }, [props.datePos]);

  // Finalna data wyświetlana w UI – zmienia się w zależności od state
  const [isDate, setDate] = useState(isBasedDate);

  useEffect(() => {
    const counter = Math.floor(props.dateState / 3);
    const totalMonths = isBasedDate.month + counter * 3;
    const correctedMonth = ((totalMonths - 1) % 12 + 12) % 12 + 1;
    const yearOffset = Math.floor((totalMonths - 1) / 12);

    setDate({
      year: isBasedDate.year + yearOffset,
      month: correctedMonth,
      day: isBasedDate.day,
    });
  }, [props.dateState, isBasedDate]);

    // useEffect(()=>{
    //   let counter =  Math.floor(props.dateState/3)
    //   if(props.datePos == 0){
    //     console.log(isDate, Math.abs(counter * 3))
    //   }
    // },[props.datePos, isDate, props.dateState])
    

     const whoevermonthIam = (index)=>{
      const getFD = firstDay(isDate)
      const d = index - getFD + 1
      if(d <= daysInMonth(isDate) && d > 0){
        return true
      }else if(d <= daysInMonth(isDate) && d <= 0){
        return false
      }else{
        return false
      }
      //return d <= daysInMonth() ||  ? true : false
    }
    function firstDay (d) {
      const f =  new Date(d.year, d.month -1, 1); // miesiące od 0-11;  dni 0-6 ; 0-niedziela
      return f.getDay()
    }
    const daysInMonth = (d) =>{
      return new Date(d.year, d.month, 0).getDate();
    }
    const lastmonthLastdays = (d)=>{
      return new Date(d.year, d.month-1, 0).getDate();
    }

    const dayNumber = (i)=>{
      const getFD = firstDay(isDate)
      if(i === getFD){
        return 1
      }
      else{
        const d = i - getFD + 1
        if( d <= daysInMonth(isDate) && d > 0){
          return d
        }else if(d >= daysInMonth(isDate) -1){
          return i - daysInMonth(isDate) - firstDay(isDate) + 1
        }else if(d <= daysInMonth(isDate) && d <= 0){
          return d + lastmonthLastdays(isDate)
        }
        //return d <= daysInMonth() ? d : i - daysInMonth() - firstDay() + 2
      }
    }
    const setSelect = (e)=>{
      setDate({...isDate, day:e})
      props?.selectedValue({year: isDate.year, month: isDate.month, day: e})

    }
    const [occupiedDays, setOccupiedDays] = useState([]); 
    const data = JSON.stringify({
        year: isDate.year,
        month: isDate.month  
    })
    useEffect(()=>{(async()=>{
        try{
          const response = await fetch('http://localhost:3003/api/checkappointment',{
            method:'POST',
            headers:{
              'Content-Type':'application/json',
            },
            body: data
          });

          if(response.ok){
            setOccupiedDays(await response.json())
            console.log("cwl")
          }
        }catch (error) {
          console.error('Error:', error);
        }

      })();
    },[isDate.month, isDate.year])

  const [width, setWidth] = useState(window.innerWidth)
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
  let mediumViewport = 1200
  let smallViewport = 690
    
  const Days = ViewportWidth > smallViewport ?  [
        {day: "niedziela"},
        {day : "poniedziałek"},
        {day: "wtorek"},
        {day: "środa"},
        {day: "czwartek"},
        {day: "piątek"},
        {day: "sobota"}
    ]:[
        {day: "nd"},
        {day : "pn"},
        {day: "wt"},
        {day: "śr"},
        {day: "czw"},
        {day: "pt"},
        {day: "sb"}
    ];

  return (
    <div className="w-full h-full flex overflow-hidden relative">
        <motion.div className="grid-7x6 stable absolute h-full hidden w-full ">
          {Days.map((item, index)=>(
            <div className={`font-Poppins flex justify-center items-center text-[#c0c0c0] a1:text-[20px] mm:text-[16px] text-[12px] ${
              [0].includes(index) ? "":""
            } ${
              [6].includes(index) ? "":""
            } ${
              [0,6].includes(index) ? "":""
            }`} key={index}>{item.day}</div>
          ))}
            {Array.from({ length: 42 }, (_, index) => (
              <div onClick={()=> whoevermonthIam(index) ? setSelect(dayNumber(index)) : null} className={`cell bg-[#161616] mx-2 flex justify-center items-center relative a1:text-[16px] mm:text-[12px] text-[10px] z-[2] ${
                whoevermonthIam(index) ? "text-white cursor-pointer " : "text-[#626262]"
              } ${
                [36,37,38,39,40,35,41].includes(index) ? "rounded-b-[40px] pb-10":""
              } ${
                [0,1,2,3,4,5,6].includes(index) ? "rounded-t-[40px] pt-10":""
              }${
                [0,7,14,21,28,35].includes(index) ? " bg-[#452572] ":""
              }${
                [36,37,38,39,40,6,13,20, 27, 34,0,7,14,21,28,35,41].includes(index) ? "":" "
              }`}><div className={`mm:p-4 size-auto rounded-full ease-in-out duration-300 ${whoevermonthIam(index) ? "bg-radial":""}`}><p className={`${
                occupiedDays.includes(dayNumber(index)) && whoevermonthIam(index) ? "hidden" : "inline-block"
              }`}>{dayNumber(index)}</p><div className={`inline-flex rounded-full text-black ease-in-out duration-200 font-Poppins text-[14px] 01ll:px-6 01ll:py-3 mm:px-1 mm:py-1 px-[2px] py-[2px] ${
                occupiedDays.includes(dayNumber(index)) && whoevermonthIam(index) ? "bg-[#d7a6ff]" : "hidden"
              } `}>{ViewportWidth < mediumViewport ? <div className="mm:scale-[0.8] scale-[0.6]"><Close/></div>:"Zajęte"}</div></div></div>
            ))}
        </motion.div>
    </div>
  )
})

export default MonthView