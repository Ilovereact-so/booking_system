import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import MonthView from './MonthView'
import { animate, motion } from 'framer-motion'

const Month01 = forwardRef((props, ref) => {
    const date = new Date()
    const [isDate, setDate] = useState({year: date.getFullYear(), month : date.getMonth()+1, day: date.getDay()+1})
     const [isCounter, setCounter] = useState(() => {
    const saved = localStorage.getItem('isCounter');
        return saved !== null ? parseInt(saved, 10) : 0;
    });

    const [isTypeOfSwitch, setTypeOfSwitch] = useState("next")

    const handleValueChange = (newValue)=>{
        props.selectValue(newValue)
    }

    useImperativeHandle(ref, () => ({
        callInternalFunction: (e) => {
            setCounter((prev) => prev + (e === "next" ? 1 : -1));
            setTypeOfSwitch(e)
        },
    }));

  useEffect(() => {
    localStorage.setItem('isCounter', isCounter);
  }, [isCounter]);
    
  return (
    <div className='flex overflow-hidden w-full ll:min-h-[640px] mm:min-h-[500px] min-h-[400px] h-full max-h-[840px] relative justify-center items-center'>
        {
        Array.from({length:3},(_,index)=>(
            <MonthPos key={index} index = {index} counter={isCounter} type={isTypeOfSwitch} handleValueChange={handleValueChange} date={isDate} />
        ))
        }
    </div>
  )
})


    const MonthPos = ({index, counter, type, handleValueChange, date})=>{

        const opacity = (
            [0,0.25, 0.5, 0.75, 1],
            [1, 0,0,0 ,1]
        )


        const xLeftRight = (
        [0,0.25, 0.5, 0.75, 1],
        ["100%","120%","-120%", "-120%", "-100%"]
        )
        const xRightLeft = (
        [0,0.25, 0.5, 0.75, 1],
        ["-100%","-120%","120%", "120%", "100%"]
        )

        // function animateToX({element, targetX, delay= 0, duration = 0.3}) {
        //      const parent = element.parentElement;
        //     const parentWidth = parent.offsetWidth;

        //     // Pobierz aktualny X
        //     const computedTransform = window.getComputedStyle(element).transform;
        //     let currentPx = 0;

        //     if (computedTransform !== "none") {
        //         const matrix = new DOMMatrix(computedTransform);
        //         currentPx = matrix.m41;
        //     }

        //     const currentPercent = (currentPx / parentWidth) * 100;

        //     // Dodaj aktualną wartość jako pierwszy keyframe (jeśli nie podany)

        //     animate(currentPercent, targetX, {
        //         duration: duration,
        //         ease: "easeInOut",
        //         delay: delay,
        //         onUpdate: (latest) => {
        //         element.style.transform = `translateX(${latest}%)`;
        //         },
        //     });
        // }

        let left = 0
        let center = 1
        let right = 2
        const datepos = [left,center,right]
        const MonthRef = useRef();
        
        useEffect(()=>{
            (async()=>{
                if((counter + index)%3 == 0 || (counter + index)%3 == -0){
                    if(type == "next"){
                        await animate(MonthRef.current, {opacity: opacity, x: xLeftRight}, { duration: 0.3, type: "keyframes" ,ease: "easeInOut"})
                        // animateToX({element:MonthRef.current,targetX: 120, duration:0.06})
                        // animateToX({element:MonthRef.current,targetX: -120 ,delay: 0.12,duration: 0})
                        // animateToX({element:MonthRef.current,targetX: -100,delay:0.3,duration:0.1})

                    }else{
                        await animate(MonthRef.current, { x: "-100%"}, { duration: 0.3, type: "keyframes" ,ease: "easeOut"})
                        //animateToX({element:MonthRef.current,targetX: -100})
                    }
                }else if((counter + index)%3 == 1 || (counter + index)%3 == -2){
                    //console.log( index == left ? "translateX(${0}%)":"")
                    //animate(MonthRef.current, {x: "0%"}, { duration: 0.3, type: "keyframes" ,ease: "easeOut"})
                    //animateToX({element:MonthRef.current,targetX: 0})
                    await animate(MonthRef.current, { x: 0}, { duration: 0.3, type: "keyframes" ,ease: "easeOut"})

                    //animate(MonthRef.current, {opacity: 1}, {duration:0.2, type:"spring", ease:"easeInOut"})

                }else if((counter + index)%3 == 2 || (counter + index)%3 == -1){
                    if(type == "next"){
                        //animate(MonthRef.current, {x: "100%"}, { duration: 0.3, type: "keyframes" ,ease: "easeOut"})
                        //animateToX({element:MonthRef.current,targetX: 100})
                        await animate(MonthRef.current, { x: "100%"}, { duration: 0.3, type: "keyframes" ,ease: "easeOut"})
                        

                    }else{
                        await animate(MonthRef.current, {opacity: opacity, x: xRightLeft}, { duration: 0.3, type: "keyframes" ,ease: "easeInOut"})                    
                    }
                }
            })()
        },[counter])
        
        return(
            <motion.div ref={MonthRef} style={{filter: (counter + index)%3 == 1 || (counter + index)%3 == -2 ? "opacity(1)" : "opacity(0.4) invert(0.1) blur(2px)"}} className='absolute m-auto transition-[filter] h-full max-w-[1200px] w-full'>
                <MonthView selectedValue={handleValueChange} date={date} dateState = {datepos[index] + counter} datePos ={(index -1)*-1}/> {/** reverse... */}
            </motion.div>
        )
    }

export default Month01