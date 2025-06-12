import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { motion} from "framer-motion"
import { Check, Close, Spinner } from 'css.gg'

const Day = forwardRef((props,ref) => {
  const godziny = ()=>{
   //appointments, type, date
    let startHour = 9 // 9:00
    let endHour= 17 //17:00
    let interval = 30 //min
    const timeSlots = [];

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += interval) {
        const formattedHour = hour.toString().padStart(2, '0');
        const formattedMinute = minute.toString().padStart(2, '0');
        timeSlots.push(`${formattedHour}:${formattedMinute}`);
      }
    }

    return timeSlots;

  }

  const [isClientAppointments, setClientAppointments] = useState([])
  //const [isAppointmentDate, setAppointmentDate] = useState('')
  
  const hours = godziny()

  // useEffect(()=>{
  //   setClientAppointments()
  // },[type])

  useEffect(()=>{
    console.log(props.appointments)
    //CA = []
    const extractedTimes = props.appointments.map(dateTime=>{
      //const date = new Date(dateTime.appointment_date)
      //setAppointmentDate(`${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`)
      return dateTime.appointment_date.split('T')[1].replace(':00.000Z', '')
    })
    console.log(extractedTimes)
    setClientAppointments(extractedTimes)
    
    
  },[props.appointments])


  const [email, setEmail] = useState('');
  const [isEvalidate, setEValidate] = useState(false)
  const Validation = (event) =>{
        let input = event.target.value;

        setEmail(input)
        let e_pattern = !(!/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{1,})$/.test(input))
        setEValidate(e_pattern)


  }
  const [isActiveL, setActiveL] = useState(null)
  const [isActiveR, setActiveR] = useState(null)

  const [isUserMode,setUserMode] = useState('closed')
  const [isEmail,setEmailState] = useState('')
  const [isRequestInfo,setRequestInfo] = useState({state:null, message:""})
  
  const cancelAuth = ()=>{
    setUserMode('closed')
    setEmailState('')
    setTimer(30)
  }
  const [isTimer, setTimer] = useState(30)
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let timer;
    if (isRunning && isTimer > 0) {
      timer = setInterval(() => {
        setTimer((prevTime) => prevTime - 1);
      }, 1000);
    } else if (isTimer === 0) {
      setIsRunning(false); // Zatrzymanie timera, gdy czas się skończy
      setEmailState("waiting");
      clearInterval(timer); // Zapobieganie wywoływaniu po czasie 0
    }
  
    return () => clearInterval(timer);
  }, [isRunning, isTimer]);

  const sendCode = async ()=>{
    console.log("niga")
    setEmailState("send")
    setIsRunning(true);
    setTimer(30)
    //$("#S_SMS_Btn").css("background-color","#5E5E5E").css("cursor","default")
    try {
        const res = await fetch("http://localhost:3003/api/send-code", {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({email})
        });
        console.log(await res.json())
        //return await res.json();
      } catch (err) {
        console.error(err);
        //return err;
      }

  }
  window.select = async function(e) {
    setUserMode(e)
  };
  const delay = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const setAppointment = async () => {
    const time = isActiveL !== null ? isActiveL : isActiveR != null ? isActiveR : null;
    if (!time) return;

    const [hours, minutes] = time.split(":").map(Number);
    const seconds = "00";
    const appointmentDate = new Date(Date.UTC(
      props.date?.year,
      props.date?.month - 1,
      props.date?.day,
      hours,
      minutes,
      seconds
    )).toISOString();

    const delayPromise = delay(3000); // min. czas trwania całej operacji

    try {
      // 1. Sprawdzenie dostępności terminu
      const resCheck = await fetch("http://localhost:3003/api/checkapphours", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          year: props.date?.year,
          month: props.date?.month,
          day: props.date?.day
        })
      });

      const resCheckData = await resCheck.json();
      const isTaken = resCheckData.find(item => item?.appointment_date === appointmentDate);

      if (resCheck.ok && !isTaken) {
        // 2. Termin wolny → tworzymy rezerwację + czekamy 3 sekundy
        const addAppointmentPromise = fetch("http://localhost:3003/api/addappointment", {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            client_id: email,
            appointment_date: appointmentDate,
            total_cost: 0
          })
        });

        const [resAdd] = await Promise.all([addAppointmentPromise, delayPromise]);
        const data = await resAdd.json();

        if (resAdd.ok) {
          setUserMode("success");
          setRequestInfo({ state: true, message: "Pomyślnie ustawiono" });
        } else {
          setUserMode("error");
          setRequestInfo({ state: false, message: data?.message || "Błąd przy ustawianiu wizyty" });
        }
      } else {
        // Termin zajęty
        await delayPromise;
        setUserMode("error");
        setRequestInfo({ state: false, message: "Wybrana godzina jest już zajęta" });
      }
    } catch (err) {
      await delayPromise;
      console.error(err);
      setUserMode("error");
      setRequestInfo({ state: false, message: "Błąd serwera lub połączenia" });
    }
  };


  const code_ref = useRef()
  const checkCode = ()=>{
    if (code_ref.current) {
      code_ref.current.callVerifyFunction(email)
      .then( async (result) => {
          console.log(result); // Tutaj mamy dostęp do wyniku
          if(result?.success == true){
            setUserMode("appointment")
            setRequestInfo({state:result.success, message:"Umawiamy wizytę"})
            await setAppointment()
          }else{
            setRequestInfo({state:result.success, message:result.message})
          }
      })
      .catch((error) => {
        const errorData = error?.responseJSON;

        if (errorData?.failed) {
          const failedDate = new Date(errorData.failed);
          const now = new Date();
          const diffMs = now.getTime() - failedDate.getTime();
          const diffMinutes = Math.floor(diffMs / (1000 * 60));

          const timeLeft = 120 - diffMinutes;
          const formattedTime =
            timeLeft > 60
              ? `${Math.floor(timeLeft / 60)}h ${timeLeft % 60}m`
              : `${timeLeft}m`;

          setRequestInfo({
            state: errorData.success,
            message: `${errorData.message} ${formattedTime}`,
          });
        } else {
          console.error('Błąd podczas pobierania danych z odpowiedzi:', error);
          setRequestInfo({
            state: errorData?.success ?? false,
            message: errorData?.message ?? "Wystąpił nieznany błąd",
          });
        }
      });
      //setRequestInfo({state:call.PromiseResult.success, message:call.PromiseResult.message})
    }
    
  }




  const handleValueChange = (newValue) => {
    console.log(isTimer)
    console.log(newValue) // jeżeli true wszystkie kafelki są uzyte
    if(newValue){
      setEmailState("check")
    }else{
      if(isRunning && isTimer != 30){
        setEmailState("send")
      }else if(isRunning === false && isTimer !== 30){
        setEmailState("waiting")

      }
    }
  };
  useImperativeHandle(ref, () => ({
        callBackFunction: () => {
            Back();
            //setSlideType(prevElements => [...prevElements,e])
        },
      }));

  useEffect(()=>{
    props.userMode(isUserMode)
  },[isUserMode])
  
  const Back = ()=>{
    if(isActiveL == null && isActiveR == null && isSite == null){
      props.type(1)
    }else if((isActiveL != null || isActiveR != null )){
      setActiveL(null)
      setActiveR(null)
    }else{
      setSite(null)
    }
  }
  const [isSite, setSite] = useState(null)
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
  let smallViewport = 650

  useEffect(()=>{
    console.log(isSite)
  },[isSite])

  const BottominfoVariants = {
    closed:{display:"none", opacity:0},
    auth:{display:"flex", opacity:1},
    appointment:{display:"flex", opacity:1}
  }
  
  const contentBottominfoVariants = {
    closed:{display:"none", opacity:0, translateY:"200%"},
    auth:{display:"flex", opacity:1, translateY:0},
    appointment:{display:"flex", opacity:1, translateY:"-220%"},
    success:{display:"none", opacity:0, translateY:"-220%"},
    error:{display:"none", opacity:0, translateY:"-220%"},
    exit:{display:"none", opacity:0, translateY:"-220%"}
  }
  const loaderBottominfoVariants = {
    closed:{display:"none", opacity:0, translateY:"200%"},
    auth:{display:"none", opacity:0, translateY:"200%"},
    appointment:{display:"flex", opacity:1, translateY:0},
    success:{display:"flex", opacity:1, translateY:0},
    error:{display:"flex", opacity:1, translateY:0},
    exit:{display:"none", opacity:0, translateY:"-200%"}
  }
  const spiner_loaderBottominfoVariants={
      appointment:{display:"flex",opacity:1, scale:2},
      success:{display:"none", opacity:0, scale:1.5},
      error:{display:"none", opacity:0, scale:1.5},

  }
  const check_loaderBottominfoVariants = {
      auth:{display:"none",opacity:0, scale:1.5},
      appointment:{display:"none",opacity:0, scale:1.5},
      success:{display:"flex", opacity:1, scale:2},
      error:{display:"none", opacity:0, scale:1.5}
  }
  const close_loaderBottominfoVariants = {
      auth:{display:"none",opacity:0, scale:0.7},
      appointment:{display:"none",opacity:0, scale:0.7},
      success:{display:"flex", opacity:1, scale:1},
      error:{display:"flex", opacity:1, scale:1}
  }
  const closeIcon_loaderBottominfoVariants = {
      auth:{display:"none",opacity:0, scale:1.5},
      appointment:{display:"none",opacity:0, scale:1.5},
      success:{display:"none", opacity:0, scale:1.5},
      error:{display:"flex", opacity:1, scale:2}
  }
  return (
    <div className='flex w-full'>
      <div className="w-full flex  relative font-Poppins ll:text-[16px] ss:text-[14px] text-[12px] ">

          <motion.div className={`inline-flex h-min flex-col py-5 bg-[#161616] mr-2 rounded-[40px] justify-evenly ease-in-out duration-300 overflow-hidden ${
              isActiveR != null || ViewportWidth < smallViewport && isActiveL ? "min-h-[20vh] 01ll:max-h-[320px] max-h-[240px]":"min-h-[60vh] max-h-[60vh]"
            }${
              (ViewportWidth < smallViewport && isSite == 1) || (ViewportWidth < smallViewport && isActiveR) ? " w-0 ":" w-full ll:min-w-[284px] ss:min-w-[200px] min-w-[150px] "
            }`}>
            {hours.slice(0,(hours.length/2)).map((item, index)=>(
              <div onClick={()=>isClientAppointments.includes(item) ? (ViewportWidth > smallViewport ? null : ViewportWidth < smallViewport && isSite == null ? setSite(0) : null) : (ViewportWidth > smallViewport ? setActiveL(item) : ViewportWidth < smallViewport && isSite == null ? setSite(0) : setActiveL(item))} className={`text-white flex justify-around items-center anim-hours overflow-hidden w-full ${
                  isActiveL === item ? "bg-[rgba(200,200,200,0.43)]":""
                }${
                  isActiveR != null || ViewportWidth < smallViewport && isActiveL  ? " h-0 p-0 opacity-0 ":" h-full py-2 opacity-100 "
                }${
                  isClientAppointments.includes(item) ? "":"cursor-pointer hover:bg-[rgba(200,200,200,0.43)]"
                }`}>
                  <p>{item}</p>
                  <div className={`inline-flex ease-in-out duration-300 justify-center items-center rounded-full text-white font-Poppins ll:text-[14px] ss:text-[12px] text-[10px] ll:px-6 ss:px-4 px-3 ss:py-2 py-1 ${
                    isClientAppointments.includes(item) ? "bg-[#d7a6ff]" : "opacity-0"
                    } `}>Zajęte
                  </div>
              </div>
            ))}
            <div className={`flex flex-col w-full overflow-hidden font-Poppins mt-5 text-white h-auto ${(isActiveR !=null && ViewportWidth > smallViewport) || (isActiveL !=null && ViewportWidth < smallViewport) ? "max-h-[500px]":"max-h-0"}`}>
              <div className='flex justify-around w-full'>
                <div className='flex flex-col'>
                  <h1 className='font-bold 01ll:text-[18px] text-[15px]'>Wybrano:</h1>
                  <h1 className='01ll:text-[15px] text-[13px]'>godzina:</h1>
                </div>
                <div className='flex flex-col'>
                  <p className='01ll:text-[18px] text-[15px]'>{`${props.date?.day}.${props.date?.month}.${props.date?.year}`}</p>
                  <p className='01ll:text-[15px] text-[13px]'>{ViewportWidth > smallViewport ? isActiveR : isActiveL}</p>
                </div>
              </div>
              <input placeholder='email.gmail.com' onChange={(e)=>Validation(e)} value={email} className={`border-[1px] bg-[#e5e5e53f] border-[#E5E5E5] rounded-full inline-block px-5 01ll:py-3 py-2 w-auto text-[15px] placeholder:text-[15px] mt-8 mx-12 ${isEvalidate ? "text-[#d7a6ff]":"text-red-500"}`}/>
              <div className='w-full flex justify-center 01ll:mt-8 mt-4'>
                <div onClick={()=> isEvalidate ? setUserMode("auth") : null} className='bg-black 01ll:px-8 px-6 py-3 rounded-full text-white font-bold 01ll:text-[18px] text-[15px] cursor-pointer'>Potwierdź</div>
              </div>
            </div>
          </motion.div>
          <motion.div className={`inline-flex h-max flex-col py-5 bg-[#161616] mr-2 rounded-[40px] justify-evenly ease-in-out duration-300 overflow-hidden ${
              isActiveL != null || ViewportWidth < smallViewport && isActiveR ? "mm:min-h-[20vh] 01ll:max-h-[320px] mm:max-h-[240px]":"min-h-[60vh] max-h-[60vh]"
            }${
                (ViewportWidth < smallViewport && isSite == 0) || (ViewportWidth < smallViewport && isActiveL) ? " w-0 ":" w-full ll:min-w-[284px] ss:min-w-[200px] min-w-[150px] "
            }`}>
            {hours.slice((hours.length/2), hours.length).map((item, index)=>(
              <div onClick={()=>isClientAppointments.includes(item) ? (ViewportWidth > smallViewport ? null : ViewportWidth < smallViewport && isSite == null ? setSite(1) : null) : (ViewportWidth > smallViewport ? setActiveR(item): ViewportWidth < smallViewport && isSite == null ? setSite(1) : setActiveR(item)) } className={`text-white flex justify-around items-center anim-hours overflow-hidden w-full ${
                  isActiveR === item ? "bg-[rgba(200,200,200,0.43)]":""
                }${
                  isActiveL != null || ViewportWidth < smallViewport && isActiveR ? " h-0 p-0 opacity-0 ":" h-full py-2 opacity-100 "
                } ${
                  isClientAppointments.includes(item) ? "":"cursor-pointer hover:bg-[rgba(200,200,200,0.43)]"
                }`}>
                  <p>{item}</p>
                  <div className={`inline-flex ease-in-out duration-300 justify-center items-center rounded-full text-white font-Poppins ll:text-[14px] ss:text-[12px] text-[10px] ll:px-6 ss:px-4 px-3 ss:py-2 py-1 ${
                    isClientAppointments.includes(item) ? "bg-[#d7a6ff]" : "opacity-0"
                    } `}>Zajęte
                  </div>
              </div>
            ))}
            <div className={`flex flex-col w-full overflow-hidden font-Poppins mt-5 text-white h-auto ${(isActiveL !=null && ViewportWidth > smallViewport) || (isActiveR != null && ViewportWidth < smallViewport) ? "max-h-[500px]":"max-h-0"}`}>
              <div className='flex justify-around w-full'>
                <div className='flex flex-col'>
                  <h1 className='font-bold 01ll:text-[18px] text-[15px]'>Wybrano:</h1>
                  <h1 className='01ll:text-[15px] text-[13px]'>godzina:</h1>
                </div>
                <div className='flex flex-col'>
                  <p className='01ll:text-[18px] text-[15px]'>{`${props.date?.day}.${props.date?.month}.${props.date?.year}`}</p>
                  <p className='01ll:text-[15px] text-[13px]'>{isActiveL}</p>
                </div>
              </div>
              <input placeholder='email.gmail.com' onChange={(e)=>Validation(e)} value={email} className={`border-[1px] bg-[#e5e5e53f] border-[#E5E5E5] rounded-full inline-block px-5 01ll:py-3 py-2 w-autos text-[15px] placeholder:text-[15px] mt-8 mx-12 ${isEvalidate ? "text-[#d7a6ff]":"text-red-500"}`}/>
              <div className='w-full flex justify-center 01ll:mt-8 mt-4'>
                <div onClick={()=> isEvalidate ? setUserMode("auth") : null} className='bg-black 01ll:px-8 px-5 py-3 rounded-full text-white font-bold 01ll:text-[18px] text-[15px] cursor-pointer'>Potwierdź</div>
              </div>
            </div>
          </motion.div>
      </div>
      {/* <div className={`font-Poppins duration-300 ease-in-out mt-7 overflow-hidden ${
        isActive === '' ? "w-0":"ml-16 w-[300px]"
      }`}>
        <p className=' text-[20px] mb-2'>Wybrano:</p>
        <div className='bg-[#EFEFEF] rounded-b-[25px] '>
          <p className='font-bold text-black text-[30px] p-4'>{`${date?.day}.${date?.month}.${date?.year}`}</p>
          <p className='p-4 pt-0 text-[15px]'>godz: {isActiveR}</p>
        </div>

        <p className='mt-6 text-[15px] mb-2 pl-1'>Numer telefonu:</p>
        <input placeholder='895 069 532' onChange={(e)=>Validationtel(e)} value={phone} type='text' maxLength={11} className='border-[1px] rounded-[20px] border-[#707070] h-[35px] w-[160px] pl-2 text-[13px] focus:outline-none'/>
        <div onClick={()=> phone.length === 11 ? setUserMode('auth') : null} className={`bg-black rounded-full px-14 py-3 text-white font-bold inline-flex justify-center mt-8 ${
          phone.length === 11 ? " cursor-pointer" : ""
        }`}>Potwierdź</div>
        <p className='mt-4 text-[12px]'>informacja: na numer telefonu wyślemy 
        przypomnienie o wizycie 2 dni przed </p>
      </div> */}
      <motion.div animate={isUserMode} variants={BottominfoVariants} className='absolute top-0 right-0 w-full h-[100vh] bg-[#322a3b8f] flex flex-col justify-center items-center z-10 overflow-hidden'>
        <motion.div animate={isUserMode} variants={contentBottominfoVariants} transition={{translateX:{type:"spring", stiffness: 100, damping: 10}}} className='bg-[#161616] flex flex-col items-center justify-between font-Poppins pt-10 mm:px-20 px-10 rounded-[50px] max-w-[580px] relative text-white'>
          <i onClick={()=>cancelAuth()} className="gg-close top-4 right-8 absolute cursor-pointer"/>
          <p className='text-center text-[clamp(14px,3vw,18px)] mb-5'>Aby potwierdzić twoją wizytę wyślemy<br/>
          <span className='font-bold'> 6-ścio cyfrowy kod</span> na podany <br/> email: 
          <span className='text-[#d7a6ff] text-[clamp(13px,2vw,17px)]'> {email}</span>
          </p>
          <OTPInput codeLength={6} emailState={isEmail} ref={code_ref} selectValue={handleValueChange} />
          {isRequestInfo.state!== null? <p className={`text-[14px] mt-3 ${isRequestInfo.state === true ? "text-white" :"text-red-500"}`}>{isRequestInfo.message}</p> : null}
          <div className='flex items-center mb-3 mm:mt-8 mt-5'>
            <div id='S_SMS_Btn' onClick={()=> isEmail === "check" ? checkCode() : (isEmail === '' || isEmail === 'waiting' ?  sendCode() : null)} className={`rounded-full ease-out duration-100 py-3 px-14 w-min text-white font-bold ${
              isEmail === "send" ? "bg-[#5E5E5E] cursor-default" : "bg-black cursor-pointer "
            }`}>{isEmail === "check" ? "Zakończ" : "Wyślij"}</div>
            <div className={`loader ease-in-out duration-300 overflow-hidden ${
              isEmail === "send" ? "ml-4 w-[30px]":"ml-0 w-0"
            } `}>
            </div>
            <p className={`text-[11px] overflow-hidden ${
              isEmail === "send" ? "ml-2":" w-0"
            }`}>{isTimer}</p>
          </div>
          <p className='text-[10px] mb-4'>Naciśnij by wysłać.</p>
        </motion.div>
        <motion.div animate={isUserMode} variants={loaderBottominfoVariants} transition={{delay:"0.5"}} className='px-20 pt-10 pb-3 bg-[#161616] inline-flex flex-col absolute rounded-[40px] '>
          <motion.div animate={isUserMode} variants={spiner_loaderBottominfoVariants} className='min-h-[50px] justify-center items-center w-full scale-[2]'>
            <Spinner/>
          </motion.div>
          <motion.div animate={isUserMode} variants={check_loaderBottominfoVariants} transition={{delay:"0.5"}} className='min-h-[50px] justify-center items-center w-full'>
            <Check className='before:text-[#d7a6ff] after:text-[#d7a6ff]'/>
          </motion.div>
          <motion.div animate={isUserMode} variants={closeIcon_loaderBottominfoVariants} transition={{delay:"0.5"}} className='min-h-[50px] justify-center items-center w-full'>
            <Close className='before:text-[#d7a6ff] after:text-[#d7a6ff]'/>
          </motion.div>
          <p className='mm:text-[20px] text-[16px] text-white font-normal font-Poppins mt-[30px] mb-[10px]'>{isRequestInfo.message}</p>
          <motion.div onClick={()=> {setUserMode("closed"); setActiveL(null); setActiveR(null)}} animate={isUserMode} variants={close_loaderBottominfoVariants} transition={{delay:"0.5"}} className='bg-black px-[30px] py-[15px] mm:text-[18px] text-[16px] font-bold font-Poppins rounded-full text-white relative bottom-[-30px] inline-flex justify-center cursor-pointer'>Zamknij</motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
})

const OTPInput = forwardRef(({ codeLength = 6, selectValue, emailState }, ref) => {
  const [otp, setOtp] = useState(Array(codeLength).fill(''));

  useEffect(() => {
    const allFilled = otp.every((val) => val !== '');
    selectValue?.(allFilled);
  }, [otp]);

  useImperativeHandle(ref, () => ({
    callVerifyFunction: async (email) => {
      try {
        const res = await fetch("http://localhost:3003/api/verify-code", {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ email, code: otp.join('') })
        });
        return await res.json();
      } catch (err) {
        console.error(err);
        return err;
      }
    }
  }));

  const handleChange = (e, index) => {
    const val = e.target.value.replace(/\D/g, ''); // tylko cyfry
    if (!val) return;

    const newOtp = [...otp];
    if (val.length === 1) {
      newOtp[index] = val;
      setOtp(newOtp);
      if (index < codeLength - 1) document.getElementById(`otp-input-${index + 1}`)?.focus();
    } else {
      // Gdy wklejono wiele znaków
      val.split('').slice(0, codeLength).forEach((digit, i) => {
        newOtp[i] = digit;
      });
      setOtp(newOtp);
      const lastIndex = Math.min(val.length - 1, codeLength - 1);
      document.getElementById(`otp-input-${lastIndex}`)?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('Text').replace(/\D/g, '');
    if (!pastedData) return;

    const newOtp = Array(codeLength).fill('');
    pastedData.slice(0, codeLength).split('').forEach((char, i) => {
      newOtp[i] = char;
    });
    setOtp(newOtp);
    document.getElementById(`otp-input-${Math.min(pastedData.length - 1, codeLength - 1)}`)?.focus();
  };

 const handleKeyDown = (e, index) => {
  if (e.key === 'Backspace') {
    e.preventDefault();

    const newOtp = [...otp];

    if (newOtp[index]) {
      newOtp[index] = '';
      setOtp(newOtp);
    } else if (index > 0) {
      newOtp[index - 1] = '';
      setOtp(newOtp);
      document.getElementById(`otp-input-${index - 1}`)?.focus();
    }
  }
};

  return (
    <div className="flex gap-2">
      {otp.map((digit, i) => (
        <input
          key={i}
          id={`otp-input-${i}`}
          type="text"
          inputMode="numeric"
          maxLength="1"
          value={digit}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          onPaste={handlePaste}
          disabled={!emailState}
          className="mm:w-10 w-7 mm:h-12 h-10 rounded-md text-center bg-gray-700 text-white mm:text-xl text-[16px] focus:outline-none"
        />
      ))}
    </div>
  );
});


export default Day