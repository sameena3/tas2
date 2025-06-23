import React, { useState, useEffect } from 'react';
import { createContext } from 'react';
import { toast } from 'react-toastify';


// Create context
export const TaskContext = createContext();
// Create Provider component
export function TaskProvider({ children }) {
const [task,setTasks]=useState([]);
const[inputvalue,setinputValue]=useState("");
const[remindertimer,setRemindertime]=useState("");
const[remindme,setremindme]=useState(false);

const handletask=()=>{
if(inputvalue==="")
  return;
else{
  const obj={
    id:Date.now(),
    text:inputvalue,
    rcheck:remindme,
    rtime:remindertimer,
    completed:false,
  };
  setTasks([...task,obj]);//apends new task to the array

setinputValue("");
setRemindertime("");
setremindme(false);
}
}
const deletetask=(id)=>{
setTasks(task.filter((t)=>t.id!==id));
}
useEffect(() => {
  const interval = setInterval(() => {
   const now = Date.now();

    task.forEach((t) => {
      const timeDiff = new Date(t.rtime).getTime() - now;//convert to millisecond
            const minutesLeft = timeDiff / (60 * 1000); 
      if (
        t.rtime &&
        !t.completed &&
        t.rcheck &&//less than 10 minutes
        minutesLeft <= 10 &&
        minutesLeft > 9
                                    
      ) {
        toast.info(`⏰ Reminder: 10 minutes left to complete "${t.text}"`);
      }
    });
  }, 30000);

  return () => clearInterval(interval);
}, [task]);
//dependency arrayrestart timer whenever task changes
const pendingtasks=task.filter((t)=>t.completed===false);
const completedtaks=task.filter((t)=>t.completed===true);
const toggletask=(id)=>{

    setTasks(
      task.map((t) =>      //override
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );/*task.completed = true  
      !task.completed = !true = false*/
  };

 const Clearall = () =>{ setTasks(task.filter((t)=>!t.completed))
 };


  return (
  <TaskContext.Provider value={{
      task,
      setTasks,
      inputvalue,
      setinputValue,
      remindertimer,
      setRemindertime,
      remindme,
      setremindme,
      handletask,
      deletetask,
      toggletask,
      pendingtasks,
      completedtaks,
      Clearall
    }}>
      {children}
    </TaskContext.Provider>
  );


}

