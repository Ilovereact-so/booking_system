import { forwardRef, useEffect, useImperativeHandle, useState } from "react"
import { motion, animate } from "framer-motion"
import $ from 'jquery'

const Month = forwardRef((props, ref)=>{
    const date = new Date()
    const [isDate, setDate] = useState({year: date.getFullYear(), month : date.getMonth() +1, day: date.getDay()})
    const [isODate, setODate] = useState({year: date.getFullYear(), month : date.getMonth(), day: date.getDay()})

    // const getRandomOccupiedDays = (totalDays, numOfDays) => {
    //     let occupiedDays = new Set();
    //     while (occupiedDays.size < numOfDays) {
    //       let randomDay = Math.floor(Math.random() * totalDays) + 1;
    //       occupiedDays.add(randomDay);
    //     }
    //     return Array.from(occupiedDays);
    //   };
    
      const [occupiedDays, setOccupiedDays] = useState([]);
      const [occupiedDaysAction, setOccupiedDaysAction] = useState([])
      const send = JSON.stringify({
        year: isDate.year,
        month: isDate.month  
      })
      const oldSend = JSON.stringify({
        year: isODate.year,
        month: isODate.month  
      })

      const [oldAppointments, setOldAppointments] = useState([])
      useEffect(() => {
        // const totalDaysInMonth = 30; // np. 30 dni w miesiącu
        // const numOfOccupiedDays = 5; // np. 5 zajętych dni
        // const days = getRandomOccupiedDays(totalDaysInMonth, numOfOccupiedDays);
        // setOccupiedDays(days);
        // console.log(occupiedDays)
        $.ajax({
          url:"http://localhost:3003/api/checkappointment",
          type:"POST",
          data: send,
          crossDomain: true,
          headers: {
            "accept": "application/json",
            "Access-Control-Allow-Origin":"*"
          },
          xhrFields: {cors: false},
          contentType:"application/json; charset=utf-8",
          dataType:"json",
        }).then((res)=>{
          console.log(res)
          setOccupiedDays(res)
        }).catch((err)=>{
          console.log(err)
        })
      }, [isDate.month]);


      useEffect(() => {
        // const totalDaysInMonth = 30; // np. 30 dni w miesiącu
        // const numOfOccupiedDays = 5; // np. 5 zajętych dni
        // const days = getRandomOccupiedDays(totalDaysInMonth, numOfOccupiedDays);
        // setOccupiedDays(days);
        // console.log(occupiedDays)
        $.ajax({
          url:"http://localhost:3003/api/checkappointment",
          type:"POST",
          data: oldSend,
          crossDomain: true,
          headers: {
            "accept": "application/json",
            "Access-Control-Allow-Origin":"*"
          },
          xhrFields: {cors: false},
          contentType:"application/json; charset=utf-8",
          dataType:"json",
        }).then((res)=>{
          console.log(res)
          setOccupiedDaysAction(res)
        }).catch((err)=>{
          console.log(err)
        })
      }, [isODate.month]);
      

    const Days = [
        {day: "niedziela"},
        {day : "poniedziałek"},
        {day: "wtorek"},
        {day: "środa"},
        {day: "czwartek"},
        {day: "piątek"},
        {day: "sobota"}
    ]


    function firstDay (d) {
      const f =  new Date(d.year, d.month -1, 1); // miesiące od 0-11;  dni 0-6 ; 0-niedziela
      return f.getDay()
    }


    const daysInMonth = (d) =>{
      return new Date(d.year, d.month, 0).getDate();
    }


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

    const OldwhoevermonthIam = (index)=>{
      const getFD = firstDay(isODate)
      const d = index - getFD + 1
      if(d <= daysInMonth(isODate) && d > 0){
        return true
      }else if(d <= daysInMonth(isODate) && d <= 0){
        return false
      }else{
        return false
      }
      //return d <= daysInMonth() ||  ? true : false
    }
    const lastmonthLastdays = (d)=>{
      return new Date(d.year, d.month-1, 0).getDate();
    }
    // const OldlastmonthLastdays = ()=>{
    //   return new Date(isODate.year, isODate.month-1, 0).getDate();
    // }

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

    const OlddayNumber = (i)=>{
      const getFD = firstDay(isODate)
      if(i === getFD){
        return 1
      }
      else{
        const d = i - getFD + 1
        if( d <= daysInMonth(isODate) && d > 0){
          return d
        }else if(d >= daysInMonth(isODate) -1){
          return i - daysInMonth(isODate) - firstDay(isODate) + 1
        }else if(d <= daysInMonth(isODate) && d <= 0){
          return d + lastmonthLastdays(isODate)
        }
        //return d <= daysInMonth() ? d : i - daysInMonth() - firstDay() + 2
      }
    }

    const xf = ([0, 1],  
        ["0",  "-100%"])
    const xs = ([0, 1],  
    ["100%",  "0"])
    
    const nxf = ([0, 1],  
    ["0",  "100%"])
    const nxs = ([0, 1],  
    ["-100%",  "0"])


    //const [isSlideType, setSlideType] = useState([])
    useImperativeHandle(ref, () => ({
        callInternalFunction: (e) => {
            setIndex(e);
            //setSlideType(prevElements => [...prevElements,e])
        },
      }));

    useEffect(()=>{
      setDate({year:props?.date.year, month: props?.date.month, day: props?.date.day})
      console.log(props?.date, "props") 
    },[props.date])


    // useEffect(()=>{
    //   if(isSlideType.length > 0){
    //     setOldAppointments(occupiedDays)
    //     console.log(isSlideType[isSlideType.length - 1], "Info")
    //     if(isSlideType[isSlideType.length - 1] === "next"){
    //       if(isDate.month === 12){

    //         setODate({...isDate , month: isDate.month})
    //         console.log(isDate.year)
  
    //       }else{
    //         if(isDate.month === 1){
    //           setODate({...isDate , year: isDate.year +1, month: 1})
  
    //         }
    //         setODate({...isDate , month: isDate.month})
    //       }
    //       animate(".ftable", { x: xf}, { duration: 1, type:"keyframes", ease:"circInOut"})
    //       animate(".stable", { x: xs}, { duration: 1, type:"keyframes", ease:"circInOut"})
    //       setSlideType(prev => prev.slice(0, -1));
    //       console.log("nextPro")

    //     }else if(isSlideType[isSlideType.length - 1] ==="prev"){
    //       if(isDate.month === 1 ){

    //         setODate({...isDate , month: isDate.month})
  
    //       }else{
    //         if(isDate.month === 12){
    //           setODate({...isDate , year: isDate.year -1, month: 12})
    //         }
    //         setODate({...isDate , month: isDate.month})
    //       }
    //       animate(".ftable", { x: nxf}, { duration: 1, type:"keyframes", ease:"circInOut"})
    //       animate(".stable", { x: nxs}, { duration: 1, type:"keyframes", ease:"circInOut"})
    //       setSlideType(prev => prev.slice(0, -1));
    //     }
    //   }

      // while(isSlideType.length > 0 ){
      //   console.log(isSlideType, "Before")
      //   setSlideType(prev => prev.slice(0, -1)) // Funkcja useEffect zczytuje ruchy isSlideType a usówanie z zmiennej tez jest ruchem - X kurwa D 
      //   console.log(isSlideType, "After")
      // }
        //while(isSlideType.length < 0){
          // setOldAppointments(occupiedDays)
          // console.log(isSlideType[isSlideType.length - 1], "Info")
          // if(isSlideType[isSlideType.length - 1] === "next"){
          //   if(isDate.month === 12){

          //     setODate({...isDate , month: isDate.month})
          //     console.log(isDate.year)
    
          //   }else{
          //     if(isDate.month === 1){
          //       setODate({...isDate , year: isDate.year +1, month: 1})
    
          //     }
          //     setODate({...isDate , month: isDate.month})
          //   }
          //   animate(".ftable", { x: xf}, { duration: 1, type:"keyframes", ease:"circInOut"})
          //   animate(".stable", { x: xs}, { duration: 1, type:"keyframes", ease:"circInOut"})
          //   setSlideType(prev => prev.slice(0, -1));
          //   console.log("nextPro")

          // }else if(isSlideType[isSlideType.length - 1] ==="prev"){
          //   if(isDate.month === 1 ){

          //     setODate({...isDate , month: isDate.month})
    
          //   }else{
          //     if(isDate.month === 12){
          //       setODate({...isDate , year: isDate.year -1, month: 12})
          //     }
          //     setODate({...isDate , month: isDate.month})
          //   }
          //   animate(".ftable", { x: nxf}, { duration: 1, type:"keyframes", ease:"circInOut"})
          //   animate(".stable", { x: nxs}, { duration: 1, type:"keyframes", ease:"circInOut"})
          //   setSlideType(prev => prev.slice(0, -1));
          //}
        //}
        //}
    //},[isSlideType.length > 0])
    const setIndex = (e)=>{

        
        
        //console.log(isSlideType)
      //while (isSlideType.length > 0 ){
        setOldAppointments(occupiedDays)
        if(e === "next"){
          if(isDate.month === 12){

            setODate({...isDate , month: isDate.month})
            console.log(isDate.year)
  
          }else{
            if(isDate.month === 1){
              setODate({...isDate , year: isDate.year +1, month: 1})
  
            }
            setODate({...isDate , month: isDate.month})
          }
          animate(".ftable", { x: xf}, { duration: 0.4, type:"keyframes", ease:"circInOut"})
          animate(".stable", { x: xs}, { duration: 0.4, type:"keyframes", ease:"circInOut"})
          //setSlideType(prev => prev.slice(0, -1));
          console.log("nextPro")

        }else if(e ==="prev"){
          if(isDate.month === 1 ){

            setODate({...isDate , month: isDate.month})
  
          }else{
            if(isDate.month === 12){
              setODate({...isDate , year: isDate.year -1, month: 12})
            }
            setODate({...isDate , month: isDate.month})
          }
          animate(".ftable", { x: nxf}, { duration: 0.4, type:"keyframes", ease:"circInOut"})
          animate(".stable", { x: nxs}, { duration: 0.4, type:"keyframes", ease:"circInOut"})
          //setSlideType(prev => prev.slice(0, -1));
        //}
      }
    }
    const setSelect = (e)=>{
      props?.selectValue(e)
    } 

    
    return (
      <div className="w-[1200px] h-[630px] flex overflow-hidden relative">
        <motion.div className="grid-7x6 ftable absolute h-full w-full translate-x-[-100%]">
          {Days.map((item, index)=>(
            <div className={`font-Poppins flex justify-center items-center text-[#c0c0c0] text-[20px] ${
              [0].includes(index) ? "":""
            } ${
              [6].includes(index) ? "":""
            } ${
              [0,6].includes(index) ? "":""
            }`} key={index}>{item.day}</div>
          ))}
            {Array.from({ length: 42 }, (_, index) => (
              <div onClick={()=> OldwhoevermonthIam(index) ? setSelect(OlddayNumber(index)) : null} className={`cell bg-[#161616] mx-2 flex justify-center items-center ${
                OldwhoevermonthIam(index) ? "text-white cursor-pointer " : "text-[#626262]"
              } ${
                [36,37,38,39,40,35,41].includes(index) ? "rounded-b-[40px] pb-10":""
              } ${
                [0,1,2,3,4,5,6].includes(index) ? "rounded-t-[40px] pt-10":""
              }${
                [0,7,14,21,28,35].includes(index) ? " bg-[#452572] ":""
              }${
                [36,37,38,39,40,6,13,20, 27, 34,0,7,14,21,28,35,41].includes(index) ? "":""
              }`}><p className={`${
                oldAppointments.includes(OlddayNumber(index)) && OldwhoevermonthIam(index) ? "hidden" : "inline-block"
              }`}>{OlddayNumber(index)}</p><div className={`inline-flex rounded-full text-black font-Poppins text-[14px] px-6 py-3 ${
                oldAppointments.includes(OlddayNumber(index)) && OldwhoevermonthIam(index) ? "bg-[#d7a6ff]" : "hidden"
              } `}>Zajęte</div></div>
            ))}
        </motion.div>


        <motion.div className="grid-7x6 stable absolute h-full hidden w-full ">
          {Days.map((item, index)=>(
            <div className={`font-Poppins flex justify-center items-center text-[#c0c0c0] text-[20px] ${
              [0].includes(index) ? "":""
            } ${
              [6].includes(index) ? "":""
            } ${
              [0,6].includes(index) ? "":""
            }`} key={index}>{item.day}</div>
          ))}
            {Array.from({ length: 42 }, (_, index) => (
              <div onClick={()=> whoevermonthIam(index) ? setSelect(dayNumber(index)) : null} className={`cell bg-[#161616] mx-2 flex justify-center items-center ${
                whoevermonthIam(index) ? "text-white cursor-pointer " : "text-[#626262]"
              } ${
                [36,37,38,39,40,35,41].includes(index) ? "rounded-b-[40px] pb-10":""
              } ${
                [0,1,2,3,4,5,6].includes(index) ? "rounded-t-[40px] pt-10":""
              }${
                [0,7,14,21,28,35].includes(index) ? " bg-[#452572] ":""
              }${
                [36,37,38,39,40,6,13,20, 27, 34,0,7,14,21,28,35,41].includes(index) ? "":" "
              }`}><p className={`${
                occupiedDays.includes(dayNumber(index)) && whoevermonthIam(index) ? "hidden" : "inline-block"
              }`}>{dayNumber(index)}</p><div className={`inline-flex rounded-full text-black ease-in-out duration-200 font-Poppins text-[14px] px-6 py-3 ${
                occupiedDays.includes(dayNumber(index)) && whoevermonthIam(index) ? "bg-[#d7a6ff]" : "hidden"
              } `}>Zajęte</div></div>
            ))}
        </motion.div>
      </div>
    )
  })


  export default Month